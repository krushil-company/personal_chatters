/* @odoo-module */

import { Notebook } from "@web/core/notebook/notebook";
import { patch } from "@web/core/utils/patch";
import { session } from "@web/session";
import { rpc } from "@web/core/network/rpc";
import { registry } from "@web/core/registry";
import { Component, useEffect, useExternalListener, useRef, useState } from "@odoo/owl";
import { browser } from "@web/core/browser/browser";
import { onWillUpdateProps } from "@odoo/owl";

import { App } from "@odoo/owl";
import { getTemplate } from "@web/core/templates";
import { _t } from "@web/core/l10n/translation";
import { Chatter } from "@mail/chatter/web_portal/chatter";


patch(Notebook.prototype, {
    setup() {
        console.log("starter code");
        this.activePane = useRef("activePane");
        this.anchorTarget = null;
        this.pages = this.computePages(this.props);
        this.state = useState({ currentPage: null });
        this.state.currentPage = this.computeActivePage(this.props.defaultPage, true);

//        useExternalListener(browser, "click", this.onAnchorClicked);

        useEffect(
            () => {
                this.props.onPageUpdate(this.state.currentPage);

                if (this.anchorTarget) {
                    const matchingEl = this.activePane.el.querySelector(`#${this.anchorTarget}`);
                    scrollTo(matchingEl, { isAnchor: true });
                    this.anchorTarget = null;
                }

                this.activePane.el?.classList.add("show");

                // ✅ Add your chatter logic here:
                const chatterEl = document.getElementById("discuss_xyz");
                const pageEl = this.activePane.el;

                if (!pageEl || !chatterEl) {
                    console.warn("Chatter or page element missing");
                    return;
                }

                const hasTextarea = pageEl.querySelector("textarea") !== null;
                const hasX2Many = pageEl.querySelector(".o_field_x2many") !== null;

                // Check if current page allows chatter
                const currentPageTuple = this.pages.find(([id]) => id === this.state.currentPage);
                const pageConfig = currentPageTuple?.[1] || {};
                const pageWantsChatter = pageConfig.showChatter !== false;

                const shouldShowChatter = pageWantsChatter && !(hasTextarea || hasX2Many);


                if (shouldShowChatter) {
//                    console.log('***this', this.env.searchModel.resModel);
                    pageEl.appendChild(chatterEl);
                    chatterEl.style.display = "";
                    chatterEl.setAttribute("data-res_model", this.env.searchModel.resModel);
                    chatterEl.setAttribute("data-res_id", this.env.model.root.resId);
                    chatterEl.setAttribute("data-allow_composer", "1");

                    // Clean previous content
                    chatterEl.innerHTML = "";

                    // ✅ Mount the real OWL Chatter
                    new App(Chatter, {
                        env: this.env,
                        props: {
                            threadModel: this.env.searchModel.resModel,
                            threadId: this.env.model.root.resId,
                            composer: true,
                            has_activities: true,
                        },
                        getTemplate,
                        translateFn: _t,
                    }).mount(chatterEl);

                    console.log(`✅ Chatter mounted for model ${this.env.searchModel.resModel} id ${this.env.model.root.resId}`);
                } else {
                    chatterEl.style.display = "none";
                    chatterEl.innerHTML = ""; // remove if not showing
                    console.log("❌ Chatter hidden (page disabled or has textarea/x2many detected)");
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
    }
});