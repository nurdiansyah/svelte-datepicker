<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { contextKey } from "./lib/context.js";

  export let applyLabel = "Apply";
  export let closeLabel = "close";

  const dispatch = createEventDispatcher();

  const { config, component, isDateChosen } = getContext(contextKey);

  function pickHandler() {
    isDateChosen.set(true);
    dispatch("pick");
    close();
  }

  function close() {
    dispatch("close");
  }
</script>

<div class="toolbar">
  <button type="button" class="button close" on:click|preventDefault={close}>
    {closeLabel}
  </button>
  <button
    type="button"
    class="button confirm"
    on:click|preventDefault={pickHandler}
  >
    {applyLabel}
  </button>
</div>

<style>
  .toolbar {
    display: flex;
    flex: 1 0 auto;
    border-top: 1px solid var(--toolbar-border-color);
    padding: 6px;
    justify-content: flex-end;
  }

  .button {
    font-size: 13px;
    border: 0;
    font-weight: 500;
    max-width: 340px;
    margin-right: 5px;
    flex: 0 0 auto;
    padding: 6px 12px;
    border-radius: 5px;
  }

  .button.confirm {
    color: var(--time-confirm-button-text-color);
    background-color: var(--time-confirm-button-color);
  }

  .button.close {
    color: var(--time-close-button-text-color);
    background-color: var(--time-close-button-color);
  }
</style>
