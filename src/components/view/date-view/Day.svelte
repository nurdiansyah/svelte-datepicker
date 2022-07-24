<script>
    import { isDateBetweenSelected } from './date-comparison.js'
    import { contextKey } from '../../lib/context'

    export let day

    import { createEventDispatcher, getContext } from 'svelte'

    export let viewContextKey

    const { config, shouldShakeDate, highlighted, selectedStartDate, selectedEndDate } = getContext(contextKey)
    const { isDaytime } = getContext(viewContextKey)

    const dispatch = createEventDispatcher()
    const start = config.start
    const end = config.end
    const dayDisable = day.date.isSameOrAfter(end, 'day') || day.date.isSameOrBefore(start, 'day')
</script>
<div
        class="day"
        class:is-night={!$isDaytime}
        class:is-range-picker={config.isRangePicker}
        class:outside-month={!day.partOfMonth}
        class:first-of-month={day.firstOfMonth}
        class:last-of-month={day.lastOfMonth}
        class:selection-start={day.date.isSame($selectedStartDate, 'day')}
        class:selection-end={config.isRangePicker && day.date.isSame($selectedEndDate, 'day')}
        class:part-of-range={config.isRangePicker && isDateBetweenSelected($selectedStartDate, $selectedEndDate, day.date)}
        class:is-today={day.isToday}
        class:is-disabled={!day.selectable || dayDisable}
>
    <button
            class="day--label"
            class:highlighted={day.date.isSame($highlighted, 'day')}
            class:shake-date={$shouldShakeDate && day.date.isSame($shouldShakeDate, 'day')}
            class:disabled={!day.selectable || dayDisable}
            type="button"
            aria-label={day.date.format('YYYY-MM-DD')}
            on:click|stopPropagation={() => dispatch('chosen', { date: day.date })}
    >
        {day.date.date()}
    </button>
</div>

<style>
    .day {
        flex: 1 0 auto;
        height: 36px;
        display: flex;
        flex-basis: 0;
        justify-content: center;
        position: relative;
    }
    .day.outside-month,
    .day.is-disabled {
        opacity: 0.35;
    }
    .day:before {
        content: '';
        float: left;
    }
    .day--label {
        color: var(--day-text-color);
        display: flex;
        justify-content: center;
        width: 40px;
        height: 36px;
        position: relative;
        border: 1px solid var(--button-background-color);
        border-radius: 0.25rem;
        align-items: center;
        background: var(--day-background-color);
        cursor: pointer;
        transition: all 100ms linear;
        border: none;
        outline: none;
    }
    .day.is-night .day--label {
        color: var(--day-text-color-is-night);
        background: var(--day-background-color-is-night);
    }
    .day--label.disabled {
        cursor: default;
    }
    .day--label.shake-date {
        animation: shake 0.4s 1 linear;
    }
    .day.is-today.selection-end:not(.outside-month) .day--label,
    .day.selection-end:not(.outside-month) .day--label {
        background-color: var(--highlight-color);
        border: var(--highlight-color) 1px solid;
        color: var(--selected-day-text-color);
    }
    .day.selection-start:not(.outside-month) .day--label:hover,
    .day.selection-start:not(.outside-month) .day--label {
        background-color: var(--highlight-color);
        color: var(--selected-day-text-color);
    }
    .day.part-of-range:before,
    .day.selection-start:before,
    .day.selection-end:before {
        content: "";
        position: absolute;
        height: 36px;
        width: 100%;
    }
    .day.is-range-picker.part-of-range:before,
    .day.is-range-picker.selection-start:before,
    .day.is-range-picker.selection-end:before {
        background-color: var(--passive-highlight-color);
    }
    .day.is-range-picker.selection-start:not(.selection-end) .day--label {
        border-radius: .25rem 0 0 .25rem;
    }
    .day.is-range-picker.selection-end:not(.selection-start) .day--label {
        border-radius: 0 .25rem .25rem 0;
    }
    .day.selection-start:before,
    .day.selection-end:before {
        width: .25rem;
    }
    .day.selection-start:before {
        right: 0;
    }
    .day.selection-end:before {
        left: 0;
    }
    .day.is-range-picker.part-of-range:hover {
        background-color: var(--passive-highlight-color);
        border-color: var(--passive-highlight-color);
        /* color: var(--button-background-color); */
    }
    @media (min-width: 480px) {
        .day--label.highlighted,
        .day--label:not(.disabled):hover {
            background: var(--day-highlighted-background-color);
            border-color: var(--day-highlighted-background-color);
            color: var(--day-highlighted-text-color);
        }
    }
    .day.outside-month.selection-start.selection-end.is-today .day--label.highlighted,
    .day.outside-month.is-today .day--label.highlighted,
    .day.outside-month.part-of-range:before,
    .day.outside-month.part-of-range:hover,
    .day.outside-month.part-of-range,
    .day.outside-month.selection-end:before,
    .day.outside-month.selection-start:before,
    .day.outside-month.selection-end,
    .day.outside-month.selection-start,
    .day.selection-start.selection-end:before,
    .day.first-of-month:not(.outside-month).part-of-range:before,
    .day.last-of-month:not(.outside-month).part-of-range:before {
        background-color: var(--day-background-color);
        border: none;
        color: var(--day-text-color);
    }
    .day.part-of-range:not(.outside-month) .day--label.highlighted {
        background-color: transparent;
    }
    .day.part-of-range:not(.outside-month) .day--label:hover {
        background-color: var(--highlight-color);
        border-radius: 0;
        color: var(--selected-day-text-color);
    }

    .day.is-range-picker.first-of-month:not(.outside-month).selection-end:not(.selection-start):before,
    .day.is-range-picker.first-of-month:not(.outside-month).part-of-range {
        background-color: var(--passive-highlight-color);
    }
    .day.is-range-picker.last-of-month:not(.outside-month).selection-start:not(.selection-end):before,
    .day.is-range-picker.last-of-month:not(.outside-month).part-of-range {
        background-color: var(--passive-highlight-color);
    }
    .day.is-today .day--label {
        opacity: 1;
        background: none;
        border: var(--highlight-color)  1px solid;
        color: var(--current-day-text-color);
    }

    .day.is-today .day--label:hover {
        background-color: var(--passive-highlight-color);
    }

    @keyframes shake {
        0% { transform: translate(7px); }
        20% { transform: translate(-7px); }
        40% { transform: translate(3px); }
        60% { transform: translate(-3px); }
        80% { transform: translate(1px); }
        100% { transform: translate(0px); }
    }
</style>
