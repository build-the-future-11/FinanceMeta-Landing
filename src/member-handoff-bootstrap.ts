import { getMemberHandoffUrl, hasConfiguredMemberHandoff } from "./member-handoff";

const joinSelector =
  'a[href^="mailto:financeforalledu@gmail.com?subject=FinanceMeta%20-%20Get%20Involved"]';

function configureJoinLink() {
  const joinLink = document.querySelector<HTMLAnchorElement>(joinSelector);
  if (!joinLink) return false;

  joinLink.href = getMemberHandoffUrl();
  joinLink.dataset.memberHandoff = "configured";
  joinLink.setAttribute("aria-label", "Open FinanceMeta member platform");
  joinLink.textContent = "Open member platform";
  return true;
}

function installMemberHandoff() {
  if (!hasConfiguredMemberHandoff()) return;
  if (configureJoinLink()) return;

  const root = document.getElementById("root") ?? document.body;
  const observer = new MutationObserver(() => {
    if (configureJoinLink()) observer.disconnect();
  });

  observer.observe(root, { childList: true, subtree: true });

  // Never leave a long-lived observer behind if the landing markup changes.
  window.setTimeout(() => observer.disconnect(), 5_000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", installMemberHandoff, { once: true });
} else {
  installMemberHandoff();
}
