/* @odoo-module */

import { Notebook } from "@web/core/notebook/notebook";
import { patch } from "@web/core/utils/patch";
import { session } from "@web/session";
import { rpc } from "@web/core/network/rpc";
import { registry } from "@web/core/registry";
import { Component, useEffect, useExternalListener, useRef, useState } from "@odoo/owl";
import { browser } from "@web/core/browser/browser";
import { onWillUpdateProps } from "@odoo/owl";


patch(Notebook.prototype, {
    setup() {
    console.log("starter code");
    this.activePane = useRef("activePane");
    this.anchorTarget = null;
    this.pages = this.computePages(this.props);
    this.state = useState({ currentPage: null });
    this.state.currentPage = this.computeActivePage(this.props.defaultPage, true);

    useExternalListener(browser, "click", this.onAnchorClicked);

    useEffect(
        () => {
            // This runs AFTER the page switches and renders
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

            const shouldShowChatter = !(hasTextarea || hasX2Many);

            if (shouldShowChatter) {
                pageEl.appendChild(chatterEl);
                chatterEl.style.display = "";
                chatterEl.setAttribute("data-res_model", this.env.model.root.model);
                chatterEl.setAttribute("data-res_id", this.env.model.root.resId);
                chatterEl.setAttribute("data-allow_composer", "1");
                console.log(`✅ Chatter shown for model ${this.env.model.root.model} id ${this.env.model.root.resId}`);
            } else {
                chatterEl.style.display = "none";
                console.log("❌ Chatter hidden (textarea or x2many detected)");
            }
        },
        () => [this.state.currentPage]  // runs every time page changes
    );

    onWillUpdateProps((nextProps) => {
        const activateDefault =
            this.props.defaultPage !== nextProps.defaultPage || !this.defaultVisible;
        this.pages = this.computePages(nextProps);
        this.state.currentPage = this.computeActivePage(nextProps.defaultPage, activateDefault);
    });
}
});