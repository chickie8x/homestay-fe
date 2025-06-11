import { format } from 'date-fns'

export const currencyFormat = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

export const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy')
}

export const discountPercentageCalc = (timeRange) => {
  if (timeRange.length === 1) {
    return 0
  } else if (timeRange.length === 2) {
    return 10
  } else return 20
}

