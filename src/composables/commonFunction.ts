import moment from "moment"
import { useGroupsStore } from "@/stores/store"

export default function () {
	const host =
		process.env.NODE_ENV === "production"
			? `https://${location.host}`
			: `http://${location.host}`
	const hostname =
		process.env.NODE_ENV === "production"
			? `https://${location.hostname}`
			: `https://erp.shinymark.com`
	const host_cors =
		process.env.NODE_ENV === "production"
			? `https://${location.host}`
			: `https://erp.shinymark.com:4443`
	const $ASPNET_SALT = `${hostname}${moment().format("YYYY/MM/DD")}`

	const $Input_Clean = (
		obj: { [x: string]: null },
		Name: string | number
	) => {
		obj[Name] = null
	}

	const $CheckGroup = (array: any[]) => {
		return useGroupsStore().getGroups.some((element) => (array.some((item) => (item === element))))
	}

	const _RestrictChars = /[%+'/|&]/g
	const $RestrictChars = _RestrictChars
	const $RestrictChars_Replace = ($Event: { target: { value: string } }) => {
		$Event.target.value = $Event.target.value.replace(_RestrictChars, '')
	}

	const defDate = ['YYYYMMDD', 'YYYY/M/D', 'YYYY-M-D', 'YYYY/MM/DD', 'YYYY-MM-DD', 'YY/MM/DD', 'YY-MM-DD', 'YYMMDD', 'YY/M/D', 'YY-M-D', 'MMDD', 'MM/DD', 'MM-DD', 'M/D', 'M-D']
	const $CheckDate = (_date: moment.MomentInput) => {
		return moment(_date, defDate, true).isValid()
	}
	const $FillUp_Date = (_date: moment.MomentInput) => {
		const defDate = ['YYYYMMDD', 'YYYY/M/D', 'YYYY-M-D', 'YYYY/MM/DD', 'YYYY-MM-DD', 'YY/MM/DD', 'YY-MM-DD', 'YYMMDD', 'YY/M/D', 'YY-M-D', 'MMDD', 'MM/DD', 'MM-DD', 'M/D', 'M-D']
		return moment(_date, defDate, true).isValid() ? (moment(_date, defDate, true).format('YYYY/MM/DD')) : (moment().format('YYYY/MM/DD'))
	}

	const $CheckTime = (_date: moment.MomentInput) => {
		const defTime = ['HH:mm:ss', 'HHmmss', 'HHmm', 'HH:mm']
		return moment(_date, defTime, true).isValid()
	}

  const $CommaFormat = function (value : string | number) {
    // console.log(isNaN(value))
    return (value === '' || value === null ) ? value : value.toLocaleString()
  }

  const $CommaFormat_F = function (value: string | number, Fixed: number) {
    // console.log(isNaN(value))
    return (value === '' || value === null ) ? value : Number(value).toLocaleString('zh-TW', { minimumFractionDigits: Fixed, maximumFractionDigits: Fixed })
  }

	return {
		host,
		hostname,
		host_cors,
		$ASPNET_SALT,
		$Input_Clean,
		$CheckGroup,
		$RestrictChars,
		$RestrictChars_Replace,
		$CheckDate,
		$FillUp_Date,
		$CheckTime,
    $CommaFormat,
    $CommaFormat_F
	}
}
