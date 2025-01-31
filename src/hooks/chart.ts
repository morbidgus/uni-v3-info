import { useMemo } from 'react'
import { PoolChartEntry } from 'state/pools/reducer'
import { TokenChartEntry } from 'state/tokens/reducer'
import { ChartDayData, GenericChartEntry } from 'types'
import { unixToDate } from 'utils/date'
import dayjs from 'dayjs'

function unixToType(unix: number, type: 'month' | 'week') {
  const date = dayjs.unix(unix).utc()

  switch (type) {
    case 'month':
      return date.format('YYYY-MM')
    case 'week':
      let week = String(date.week())
      if (week.length === 1) {
        week = `0${week}`
      }
      return `${date.year()}-${week}`
  }
}

export function useTransformedVolumeData(
  chartData: ChartDayData[] | PoolChartEntry[] | TokenChartEntry[] | undefined,
  type: 'month' | 'week'
) {
  return useMemo(() => {
    if (chartData) {
      const data: Record<string, GenericChartEntry> = {}

      chartData.forEach(({ date, volumeUSD }: { date: number; volumeUSD: number }) => {
        const group = unixToType(date, type)
        if (data[group]) {
          data[group].value += volumeUSD
        } else {
          data[group] = {
            time: unixToDate(date),
            value: volumeUSD,
          }
        }
      })

      return Object.values(data)
    } else {
      return []
    }
  }, [chartData, type])
}

export function useTransformedTVLData(
  chartData: ChartDayData[] | PoolChartEntry[] | TokenChartEntry[] | undefined,
  type: 'month' | 'week'
) {
  return useMemo(() => {
    if (chartData) {
      const data: Record<string, GenericChartEntry> = {}

      chartData.forEach(({ date, tvlUSD }: any) => {
        const group = unixToType(date, type)
        if (data[group]) {
          data[group].value += tvlUSD
        } else {
          data[group] = {
            time: unixToDate(date),
            value: tvlUSD,
          }
        }
      })

      return Object.values(data)
    } else {
      return []
    }
  }, [chartData, type])
}

export function useTransformedTotalValueLockedUSDData(
  chartData: ChartDayData[] | PoolChartEntry[] | TokenChartEntry[] | undefined,
  type: 'month' | 'week'
) {
  return useMemo(() => {
    if (chartData) {
      const data: Record<string, GenericChartEntry> = {}

      chartData.forEach(({ date, totalValueLockedUSD }: any) => {
        const group = unixToType(date, type)
        if (data[group]) {
          data[group].value += totalValueLockedUSD
        } else {
          data[group] = {
            time: unixToDate(date),
            value: totalValueLockedUSD,
          }
        }
      })

      return Object.values(data)
    } else {
      return []
    }
  }, [chartData, type])
}

export function useTransformedFeesData(
  chartData: ChartDayData[] | PoolChartEntry[] | TokenChartEntry[] | undefined,
  type: 'month' | 'week'
) {
  return useMemo(() => {
    if (chartData) {
      const data: Record<string, GenericChartEntry> = {}

      chartData.forEach(({ date, feesUSD }: any) => {
        const group = unixToType(date, type)
        if (data[group]) {
          data[group].value += feesUSD
        } else {
          data[group] = {
            time: unixToDate(date),
            value: feesUSD,
          }
        }
      })

      return Object.values(data)
    } else {
      return []
    }
  }, [chartData, type])
}

export function useTransformedPriceData(
  chartData: ChartDayData[] | PoolChartEntry[] | TokenChartEntry[] | undefined,
  type: 'month' | 'week'
) {
  return useMemo(() => {
    if (chartData) {
      const data: Record<string, GenericChartEntry> = {}

      chartData.forEach(({ date, priceUSD }: any) => {
        const group = unixToType(date, type)
        if (data[group]) {
          data[group].value += priceUSD
        } else {
          data[group] = {
            time: unixToDate(date),
            value: priceUSD,
          }
        }
      })

      return Object.values(data)
    } else {
      return []
    }
  }, [chartData, type])
}
