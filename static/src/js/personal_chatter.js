import { Composer } from "@mail/core/common/composer";
import { Thread } from "@mail/core/common/thread";

import {
    Component,
    onMounted,
    onWillUpdateProps,
    useChildSubEnv,
    useRef,
    useState,
} from "@odoo/owl";

import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";
import { useThrottleForAnimation } from "@web/core/utils/timing";

import { Dropdown } from "@web/core/dropdown/dropdown";
// import { FollowerList } from "@mail/core/common/follower_list";
// import { Activity } from "@mail/core/common/activity";
// import { ScheduledMessage } from "@mail/core/common/scheduled_message";
// import { AttachmentList } from "@mail/core/common/attachment_list";
// import { SearchMessageInput } from "@mail/core/common/search_message_input";
// import { SearchMessageResult } from "@mail/core/common/search_message_result";
// import { SuggestedRecipientsList } from "@mail/core/common/suggested_recipients_list";
// import { BaseRecipientsList } from "@mail/core/common/base_recipients_list";
import { FileUploader } from "@web/views/fields/file_handler";


/**
 * @typedef {Object} Props
 * @extends {Component<Props, Env>}
 */
export class PersonalChatter extends Component {
    static template = "mail.PersonalChatter";
    static components = {
    Thread,
    Composer,
    FileUploader,
    Dropdown,
    // FollowerList,
    // Activity,
    // ScheduledMessage,
    // AttachmentList,
    // SearchMessageInput,
    // SearchMessageResult,
    // SuggestedRecipientsList,
    // BaseRecipientsList,
};
    static props = ["composer?", "threadId?", "threadModel", "twoColumns?"];
    static defaultProps = { composer: true, threadId: false, twoColumns: false };

    setup() {
        console.log("1234")
        this.store = useState(useService("mail.store"));
        this.state = useState({
            jumpThreadPresent: 0,
            /** @type {import("models").Thread} */
            thread: undefined,
            aside: false,
            activities: [],
            scheduledMessages: [],
            attachments: [],
            isSearchOpen: false,
            isAttachmentBoxOpened: false,
            composerType: null,
            showActivities: false,
            showScheduledMessages: false,
            unfollowHover: { isHover: false },
            messageSearch: { searching: false, searched: false },
        });
        this.rootRef = useRef("root");
        this.onScrollDebounced = useThrottleForAnimation(this.onScroll);
        useChildSubEnv(this.childSubEnv);

        onMounted(this._onMounted);
        onWillUpdateProps((nextProps) => {
            if (
                this.props.threadId !== nextProps.threadId ||
                this.props.threadModel !== nextProps.threadModel
            ) {
                this.changeThread(nextProps.threadModel, nextProps.threadId);
            }
            if (!this.env.chatter || this.env.chatter?.fetchData) {
                if (this.env.chatter) {
                    this.env.chatter.fetchData = false;
                }
                this.load(this.state.thread, this.requestList);
            }
        });
    }

    get afterPostRequestList() {
        return ["messages"];
    }

    get childSubEnv() {
        return { inChatter: this.state };
    }

    get onCloseFullComposerRequestList() {
        return ["messages"];
    }

    get requestList() {
        return [];
    }

    changeThread(threadModel, threadId) {
        this.state.thread = this.store.Thread.insert({ model: threadModel, id: threadId });
        if (threadId === false) {
            if (this.state.thread.messages.length === 0) {
                this.state.thread.messages.push({
                    id: this.store.getNextTemporaryId(),
                    author: this.store.self,
                    body: _t("Creating a new record..."),
                    message_type: "notification",
                    thread: this.state.thread,
                    trackingValues: [],
                    res_id: threadId,
                    model: threadModel,
                });
            }
        }
    }

    /**
     * Fetch data for the thread according to the request list.
     * @param {import("models").Thread} thread
     * @param {string[]} requestList
     */
    load(thread, requestList) {
        if (!thread.id || !this.state.thread?.eq(thread)) {
            return;
        }
        thread.fetchData(requestList);
    }

    onCloseFullComposerCallback() {
        this.load(this.state.thread, this.onCloseFullComposerRequestList);
    }

    _onMounted() {
        this.changeThread(this.props.threadModel, this.props.threadId);
        if (!this.env.chatter || this.env.chatter?.fetchData) {
            if (this.env.chatter) {
                this.env.chatter.fetchData = false;
            }
            this.load(this.state.thread, this.requestList);
        }
    }

    onPostCallback() {
        this.state.jumpThreadPresent++;
        // Load new messages to fetch potential new messages from other users (useful due to lack of auto-sync in chatter).
        this.load(this.state.thread, this.afterPostRequestList);
    }

    onScroll() {
        this.state.isTopStickyPinned = this.rootRef.el.scrollTop !== 0;
    }

    onUploaded() {}
    onClickAttachFile() {}
    onAddFollowers() {}
    onFollowerChanged() {}
    onClickUnfollow() {}
    onClickFollow() {}
    closeSearch() {}
    toggleComposer() {}
    scheduleActivity() {}
    popoutAttachment() {}
    onActivityChanged() {}
    reloadParentView() {}
    onScheduledMessageChanged() {}
    unlinkAttachment() {}
    onClickAddAttachments() {}
    onSuggestedRecipientAdded() {}
}
