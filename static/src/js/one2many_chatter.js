/* @odoo-module */

import { Notebook } from "@web/core/notebook/notebook";
import { patch } from "@web/core/utils/patch";
import { session } from "@web/session";
import { rpc } from "@web/core/network/rpc";
import { registry } from "@web/core/registry";
import { Component, useEffect, useExternalListener, useRef, useState, onMounted } from "@odoo/owl";
import { browser } from "@web/core/browser/browser";
import { onWillUpdateProps } from "@odoo/owl";
import { onWillUnmount } from "@odoo/owl";

import { App } from "@odoo/owl";
import { getTemplate } from "@web/core/templates";
import { _t } from "@web/core/l10n/translation";
import { PersonalChatter } from "./personal_chatter";
import { Dialog } from "@web/core/dialog/dialog";

import { useService } from "@web/core/utils/hooks";

patch(Notebook.prototype, {
    setup() {
        console.log("starter code");
        this.activePane = useRef("activePane");
        this.anchorTarget = null;
        this.pages = this.computePages(this.props);
        this.state = useState({ currentPage: null });
        this.state.currentPage = this.computeActivePage(this.props.defaultPage, true);
        this.orm = useService("orm");
        // this._getAmazonSettings();

        useEffect(
            () => {
                this.props.onPageUpdate(this.state.currentPage);
                // this._getAmazonSettings()


                if (this.anchorTarget) {
                    const matchingEl = this.activePane.el.querySelector(`#${this.anchorTarget}`);
                    scrollTo(matchingEl, { isAnchor: true });
                    this.anchorTarget = null;
                }

                this.activePane.el?.classList.add("show");

                const chatterEl = document.getElementById("discuss_xyz");
                const pageEl = this.activePane.el;

                if (!pageEl || !chatterEl) {
                    console.warn("Chatter or page element missing");
                    return;
                }

                const hasTextarea = pageEl.querySelector("textarea") !== null;
                const hasX2Many = pageEl.querySelector(".o_field_x2many") !== null;

                const currentPageTuple = this.pages.find(([id]) => id === this.state.currentPage);
                const pageConfig = currentPageTuple?.[1] || {};
                const pageWantsChatter = pageConfig.showChatter !== false;
                const shouldShowChatter = pageWantsChatter && !(hasTextarea || hasX2Many);

                if (shouldShowChatter) {
                    if (this.chatterApp) {
                        this.chatterApp.destroy();
                        this.chatterApp = null;
                    }

                    pageEl.appendChild(chatterEl);
                    chatterEl.style.display = "";
                    chatterEl.setAttribute("data-res_model", this.env.searchModel.resModel);
                    chatterEl.setAttribute("data-res_id", this.env.model.root.resId);
                    chatterEl.setAttribute("data-allow_composer", "1");
                    chatterEl.innerHTML = "";

                    this.chatterApp = new App(PersonalChatter, {
                        env: this.env,
                        props: {
                            threadModel: this.env.searchModel.resModel,
                            threadId: this.env.model.root.resId,
                            currentPage: this.state.currentPage, // Pass page context
                            composer: true,
                            has_activities: true,
                        },
                        getTemplate,
                        translateFn: _t,
                    });

                    this.chatterApp.mount(chatterEl);

                    console.log(`✅ Chatter mounted for ${this.state.currentPage}`);
                } else {
                    if (this.chatterApp) {
                        this.chatterApp.destroy();
                        this.chatterApp = null;
                    }

                    chatterEl.style.display = "none";
                    chatterEl.innerHTML = "";
                    console.log("❌ Chatter hidden");
                }
            },
            () => [this.state.currentPage]
        );

        onWillUpdateProps((nextProps) => {
            const activateDefault =
                this.props.defaultPage !== nextProps.defaultPage || !this.defaultVisible;
            this.pages = this.computePages(nextProps);
            this.state.currentPage = this.computeActivePage(nextProps.defaultPage, activateDefault);
        });

        onWillUnmount(() => {
            if (this.chatterApp) {
                console.log("💥 Destroying chatter due to form view close");
                this.chatterApp.destroy();
                this.chatterApp = null;
            }
        });
    },

    // async _getAmazonSettings() {
    //     return rpc("/web/dataset/call_kw/mail.message/custom_method", {
    //         model: 'mail.message',
    //         method: 'custom_method',
    //         args: [[100]],
    //         kwargs: {
    //             model_name: this.env.searchModel.resModel,
    //             record_id: this.env.model.root.resId,
    //             all_data: 'heelpo',
    //         },
    //     });
    // },
});

// patch(Chatter.prototype, {
//     setup() {
//         super.setup();
//         console.log('[[[[[[[[[[[[[[[[[[[');
//     },

//     load(thread, requestList) {
//         super.load(thread, requestList);
//         console.log('|||||||||||||||||');
//     }
// });