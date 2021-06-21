<script>
    import { contextKey } from '../../lib/context'
    import {dayjs} from "../../lib/date-utils"
    import {getContext} from "svelte"

    const { config, isPredefined, selectedStartDate, selectedEndDate } = getContext(contextKey)

    function predefinedHandler(relativeTime) {
        return () => {
            if (relativeTime === "today") {
                selectedStartDate.set(dayjs());
                selectedEndDate.set(dayjs())
            }
            else if(relativeTime === "yesterday") {
                selectedStartDate.set(dayjs().subtract(1, "d"));
                selectedEndDate.set(dayjs())
            }
            else if(relativeTime === "week") {
                selectedStartDate.set(dayjs().subtract(1, "d"));
                selectedEndDate.set(dayjs())
            }
            else if(relativeTime === "month") {
                selectedStartDate.set(dayjs().subtract(1, "d"));
                selectedEndDate.set(dayjs())
            }
            else if(relativeTime === "year") {
                selectedStartDate.set(dayjs().subtract(1, "d"));
                selectedEndDate.set(dayjs())
            }
        }
    }

</script>

<ul>
    <li>
        <a href="#/" target="_self" on:click|preventDefault={predefinedHandler("today")} on:click>
            Hari Ini
        </a>
    </li>
    <li>
        <a href="#/" target="_self" on:click|preventDefault={predefinedHandler("yesterday")} on:click>
            Kemarin
        </a>
    </li>
    <li>
        <a href="#/" target="_self" on:click|preventDefault={predefinedHandler("week")} on:click>
            Seminggu yang Lalu
        </a>
    </li>
    <li>
        <a href="#/" target="_self" on:click|preventDefault={predefinedHandler("month")} on:click>
            Sebulan yang Lalu
        </a>
    </li>
    <li>
        <a href="#/" target="_self" on:click|preventDefault={predefinedHandler("year")} on:click>
            Setahun yang Lalu
        </a>
    </li>
    <li>
        <a href="#/" target="_self" on:click|preventDefault={predefinedHandler()} on:click>
            Pilih
        </a>
    </li>
</ul>
