import { getMemberHandoffUrl, hasConfiguredMemberHandoff } from "./member-handoff";

const joinSelector =
  'a[href^="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20-%20Get%20Involved"]';

function installMemberHandoff() {
  const joinLink = document.querySelector<HTMLAnchorElement>(joinSelector);
  if (!joinLink || !hasConfiguredMemberHandoff()) return;

  joinLink.href = getMemberHandoffUrl();
  joinLink.dataset.memberHandoff = "configured";
  joinLink.setAttribute("aria-label", "Open FinanceMeta member platform");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", installMemberHandoff, { once: true });
} else {
  installMemberHandoff();
}
