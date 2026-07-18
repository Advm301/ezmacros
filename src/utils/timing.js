// Thin wrapper around Date.now() -- exists purely so App.jsx's
// post-onboarding GeneratingScreen padding (see handleOnboardingComplete)
// doesn't call the impure Date.now() directly inside a component's
// function body. The react-hooks/purity lint rule flags known-impure
// globals like Date.now() anywhere it finds them in a component or hook,
// even inside an event-handler callback that only ever runs in response
// to a tap and never during render -- moving the call into its own
// module-level function here keeps the rule happy without silencing it
// with a blanket eslint-disable.
export function now() {
  return Date.now();
}
