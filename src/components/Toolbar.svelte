<div class="toolbar">
  <button type="button" class="button close" on:click|preventDefault={progress}>
    {closeLabel}
  </button>
  <button type="button" class="button confirm" on:click|preventDefault={progress}>
    {applyLabel}
  </button>
</div>

<script>
  import { getContext, createEventDispatcher } from 'svelte'
  import { contextKey } from './lib/context.js'

  export let applyLabel = "Apply"
  export let closeLabel = "close"
  
  const dispatch = createEventDispatcher()

  const { config, component, isDateChosen } = getContext(contextKey)

  function finalise () {
    isDateChosen.set(true)
    dispatch('close')
  }

  function progress () {
    isDateChosen.set(false)
    if ($component === 'date-view') {
      if (config.isTimePicker) {
        component.set('time-view')
      } else {
        finalise()
      }
    } else if ($component === 'time-view') {
      finalise()
    }
  }
</script>

<style>
  .toolbar {
    padding: 0;
    display: flex;
    flex: 1 0 auto;
    justify-content: center;
  }

  .button {
    font-size: 13px;
    flex: 1 0 auto;
    padding: 12px 6px;
    border: 0;
    font-weight: 500;
    max-width: 340px;
    margin-right: 5px;
  }

  .button.confirm {
    color: var(--time-confirm-button-text-color);
    background-color: var(--time-confirm-button-color);
  }

  .button.close {
    color: var(--time-close-button-text-color);
    background-color: var(--time-close-button-color);
  }
  @media (min-width: 600px) {
    .toolbar {
      border-top: 1px solid var(--toolbar-border-color);
      padding: 6px;
      justify-content: flex-end;
    }

    .button {
      flex: 0 0 auto;
      padding: 6px 12px;
      border-radius: 5px;
    }
  }
</style>