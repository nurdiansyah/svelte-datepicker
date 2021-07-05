<script>
  import { createPopperActions } from "svelte-popperjs";
  import { dayjs } from "./lib/date-utils";
  import { contextKey, setup } from "./lib/context";
  import { createEventDispatcher, setContext, getContext } from "svelte";
  import { CalendarStyle } from "../calendar-style.js";
  import { createViewContext } from "./lib/view-context.js";
  import Toolbar from "./Toolbar.svelte";
  import View from "./view/View.svelte";

  export let range = false;
  export let placeholder = "Choose Date";
  export let format = "DD-MMMM-YYYY";
  export let startDate = dayjs().subtract(1, "year");
  export let endDate = dayjs().add(1, "year");
  export let selectableCallback = null;
  export let styling = new CalendarStyle();
  export let selected = undefined;
  export let closeOnFocusLoss = true;
  export let time = false;
  export let morning = 7;
  export let night = 19;
  export let minuteStep = 5;
  export let applyLabel = "Apply";
  export let closeLabel = "Close";
  export let className = $$props.class || "form-control";
  export let wrapperInputClass = "form-control-feedback";
  export let iconInputClass = "form-control-feedback text-grey-600";
  export let direction = "down";
  export let end = false;
  export let right = true;
  export let value = "";
  export let showClearButton = false;

  let datePickerRef;

  const [popperRef, popperContent] = createPopperActions();
  const popperPlacement = (direction, _end) => {
    let prefix = direction;
    if (direction === "up") prefix = "top";
    else if (direction === "down") prefix = "bottom";
    let suffix = end ? "end" : "start";
    return `${prefix}-${suffix}`;
  };
  const popperOptions = {
    modifiers: [{ name: "offset", options: { offset: [0, 2] } }],
    placement: popperPlacement(direction, end || right),
  };

  const dispatch = createEventDispatcher();

  const startContextKey = {};
  const endContextKey = {};

  const config = {
    start: dayjs(startDate),
    end: dayjs(endDate),
    isRangePicker: range,
    isTimePicker: time,
    closeOnFocusLoss,
    format,
    morning,
    night,
    selectableCallback,
    minuteStep: parseInt(minuteStep),
  };

  setContext(contextKey, setup(selected, config));
  const {
    cleared,
    selectedStartDate,
    selectedEndDate,
    isOpen,
    isClosing,
    highlighted,
    formatter,
    isDateChosen,
    isSelectingFirstDate,
  } = getContext(contextKey);

  setContext(startContextKey, createViewContext(true, getContext(contextKey)));

  if (config.isRangePicker) {
    setContext(endContextKey, createViewContext(false, getContext(contextKey)));
  }

  function initialisePicker() {
    highlighted.set($selectedStartDate);
    dispatch("open");
  }

  function setRangeValue() {
    selected = [$selectedStartDate, $selectedEndDate];
    dispatch("range-selected", {
      from: $selectedStartDate.toDate(),
      to: $selectedEndDate.toDate(),
    });
  }

  function setDateValue() {
    selected = $selectedStartDate.toDate();
    dispatch("date-selected", {
      date: $selectedStartDate.toDate(),
    });
  }

  function swapDatesIfRequired() {
    if (!config.isRangePicker) {
      return;
    }
    const from = $selectedStartDate;
    const to = $selectedEndDate;

    if (to.isBefore(from)) {
      selectedStartDate.set(to);
      selectedEndDate.set(from);
    }
  }

  function addDate(e) {
    const { date } = e.detail;

    if ($isSelectingFirstDate) {
      selectedStartDate.set(date);
      swapDatesIfRequired();
      config.isRangePicker && isSelectingFirstDate.update((v) => !v);
    } else {
      if ($selectedEndDate.isSame(date, "day")) {
        selectedStartDate.set(date);
      }
      selectedEndDate.set(date);
      swapDatesIfRequired();
      // popover.close()
    }
  }

  function closeHandler() {
    swapDatesIfRequired();
    $isOpen = false;
    ["click", "touchstart", "keyup"].forEach((event) => {
      document.removeEventListener(event, documentHandler, true);
    });
    dispatch("close");
  }

  function openHandler() {
    initialisePicker();
    $isOpen = true;
    ["click", "touchstart", "keyup"].forEach((event) => {
      document.addEventListener(event, documentHandler, true);
    });
  }

  function toggleHandler() {
    if ($isOpen) closeHandler();
    else openHandler();
  }

  function documentHandler(e) {
    if (e && (e.which === 3 || (e.type === "keyup" && e.which !== 9))) return;
    if (
      datePickerRef.contains(e.target) &&
      (e.type !== "keyup" || e.which === 9)
    ) {
      return;
    }
    closeHandler(e);
  }

  function pickHandler() {
    value = $formatter.formattedCombined || "";
    if (config.isRangePicker) {
      setRangeValue();
    } else {
      setDateValue();
    }
  }

  function clearHandler() {
    cleared.set(true);
    dispatch("clear");
  }

  $: {
    if (!value === "" && selected) {
      value = $formatter.formattedCombined || "";
    }

    if ($isDateChosen) {
      dispatch("change");
    }
  }
</script>

<div
  class="datepicker {wrapperInputClass}"
  class:open={$isOpen}
  class:closing={$isClosing}
  style={styling.toWrapperStyle()}
  bind:this={datePickerRef}
>
  <input
    use:popperRef
    class={className}
    {placeholder}
    {value}
    on:click={toggleHandler}
  />
  <slot name="add-on">
    <div class={iconInputClass}>
      {#if showClearButton && !$cleared}
        <a
          href="/#"
          target="_self"
          class="btn-light"
          on:click|preventDefault={clearHandler}
        >
          <i class="icon-cross3" />
        </a>
      {:else}
        <i class="icon-calendar" />
      {/if}
    </div>
  </slot>
  <slot />
  {#if $isOpen}
    <div class="contents-wrapper visible" use:popperContent={popperOptions}>
      <div class="wrapper">
        <div class="contents-inner">
          <div class="contents" class:is-range-picker={config.isRangePicker}>
            <div class="view">
              <View viewContextKey={startContextKey} on:chosen={addDate} />
              {#if config.isRangePicker}
                <View viewContextKey={endContextKey} on:chosen={addDate} />
              {/if}
            </div>
            <slot name="toolbar">
              <Toolbar
                {applyLabel}
                {closeLabel}
                on:close={closeHandler}
                on:pick={pickHandler}
              />
            </slot>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .datepicker {
    display: inline-block;
    text-align: center;
    font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1.517;
    overflow: visible;
    width: var(--datepicker-width);
  }

  .calendar-button {
    padding: 10px 20px;
    border: 1px solid var(--button-border-color);
    display: block;
    text-align: center;
    width: var(--button-width);
    text-decoration: none;
    cursor: pointer;
    background: var(--button-background-color);
    color: var(--button-text-color);
    border-radius: 7px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  .contents {
    min-width: 320px;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var(--content-background);
  }

  .view {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (min-width: 680px) {
    .view {
      flex-direction: row;
      justify-content: center;
    }
  }

  .sc-popover {
    position: relative;
  }

  .contents-wrapper {
    position: fixed;
    transition: none;
    z-index: 2;
    display: none;
  }

  .contents-wrapper.visible {
    display: block;
  }

  .contents-wrapper.visible.is-fullscreen {
    display: flex;
    width: 100vw;
    /* height: 100%; */
    padding-bottom: 80px;
    overflow: scroll;
  }

  .contents-wrapper.visible .wrapper {
    opacity: 1;
    transform: scale(1);
    display: block;
  }

  .contents-wrapper.shrink .wrapper {
    animation: shrink 150ms forwards cubic-bezier(0.92, 0.09, 0.18, 1.05);
  }

  .wrapper {
    background: #fff;
    box-shadow: 0px 10px 26px rgba(0, 0, 0, 0.4);
    opacity: 0.8;
    padding-top: 0;
    display: none;
    animation: grow 200ms forwards cubic-bezier(0.92, 0.09, 0.18, 1.05);
  }

  .contents-inner {
    animation: fadeIn 400ms forwards;
  }
</style>
