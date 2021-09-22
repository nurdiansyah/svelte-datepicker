<script>
  import Week from './Week.svelte'
  import { getContext } from 'svelte'
  import { dayjs } from '../../lib/date-utils.js'
  import { getCalendarPage } from '../../lib/calendar-page'

  export let viewContextKey
  export let id

  const { monthView, displayedDate } = getContext(viewContextKey)

  let lastId = id
  let direction
  let monthNotList
  $: {
    if (!$monthView.visibleMonth) {
      monthNotList = getCalendarPage($displayedDate, () => ({ selectable: false }))
    }
  }


  $: {
    direction = lastId < id ? 1 : -1
    lastId = id
  }
</script>

<div class="month-container">
  <div class="month-dates">
    <div class="legend">
      <div class="month-week">
        {#each dayjs.weekdaysShort() as day}
          <span>{day}</span>
        {/each}
      </div>
    </div>
    {#if $monthView.visibleMonth}
    {#each $monthView.visibleMonth.weeks as week (week.id)}
      <Week
        {viewContextKey}
        days={week.days}
        {direction}
        on:chosen
      />
    {/each}
      {:else}
      {#each monthNotList.weeks as week (week.id)}
        <Week
                {viewContextKey}
                days={week.days}
                {direction}
                on:chosen
        />
      {/each}
      {/if}
  </div>
</div>

<style>
  .month-dates { 
    width: 100%;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 1fr;
    -ms-grid-rows: 1fr;
  }

  .legend {
    display: none;
    grid-row: 1 / 2;
    color: #4a4a4a;
    padding: 10px 0;
    margin-bottom: 5px;
    color: var(--legend-text-color);
    display: grid;
  }

  .month-container {
    display: flex;
  }

  .month-week {
    width: 100%;
  }

  .legend span {
    width: 14.285714%;
    display: inline-block;
    text-align: center;
  }
</style>
