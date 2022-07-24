import dayjsBase from 'dayjs/esm'
import utc from 'dayjs/esm/plugin/utc'
import timezone from 'dayjs/esm/plugin/timezone'
import localeData from 'dayjs/esm/plugin/localeData'
import minMax from 'dayjs/esm/plugin/minMax'
import isSameOrBefore from 'dayjs/esm/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/esm/plugin/isSameOrAfter'

dayjsBase.extend(utc)
dayjsBase.extend(timezone)
dayjsBase.extend(minMax)
dayjsBase.extend(localeData)
dayjsBase.extend(isSameOrBefore)
dayjsBase.extend(isSameOrAfter)

/**
 *
 * @param {string | number } d
 * @param {*} param1
 * @returns
 */
export function dayjs (
  d = new Date(),
  { format, timezone = 'Asia/Jakarta' } = {}
) {
  if (format) {
    return dayjsBase(d, format, timezone).tz(timezone)
  }
  return dayjsBase.tz(d, timezone)
}
