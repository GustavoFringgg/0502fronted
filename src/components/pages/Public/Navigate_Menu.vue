<template>
	<div class="print-disable contentmenu" align="left">
		<table style="">
			<tbody>
				<tr>
					<th v-for="(item, idx) in Menu_Info" :key="idx">
						<div :class="item.CSSClass">
							<div :data-window="item['data-window']" @click="openWindow()" style="cursor: pointer">
								<span v-html="item.Symbol"></span>
								<span :title="item.Hint">{{ item.Name }}</span>
							</div>
							<img :src="`${hostname}/Datas/Images/System/Buttons/External_16.png`" style=" margin-left: 3px; width: 12px; height: 12px;" v-if="item.OutofLink" />
						</div>
					</th>
					<th v-for="(item, idx1) in Site_Switch" :key="'sit' + idx1">
						<div :class="item.CSSClass" v-if="Site_Switch_Flag" :style="{ 'margin-left': idx1 == 0 ? '40px' : '0px', }">
							<a :href="item.URL" style="text-decoration: none"><strong>{{ item.Site_Name }}</strong></a>
						</div>
					</th>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style>
.menubox.Newcouple {
	margin-left: 16px !important;
}

.menubox {
	position: relative;
	font-size: 12px;
	font-family: "Open Sans", Arial, Verdana, Tahoma, sans-serif;
	font-weight: bold;
	margin: -3px 0px 0px 0px;
	padding: 0.3em 0.5em 0.2em 0.5em;
	display: inline-flex;
	border: solid 1px #ccc;
	border-top: none;
	background-color: #fff;
	white-space: nowrap;
	-moz-border-radius-bottomleft: 0.5em;
	-moz-border-radius-bottomright: 0.5em;
	border-bottom-left-radius: 0.5em;
	border-bottom-right-radius: 0.5em;
}

.current-server {
	background-color: #dd4814;
	background-image: -webkit-linear-gradient(bottom, #00ffb8, #1ccbff);
}
</style>

<script setup>
import { onMounted, ref, computed } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"
import commonFunction from '@/composables/commonFunction'

const { hostname } = commonFunction()
const route = useRoute()
// const _Menu_Info = ref(null)
const WinHandle = ref(null)
const Menu_Info = ref([])
const Site_Switch_Flag = ref(0)
const Site_Switch = ref([
	{ Site_Name: "ADP", URL: "https://ADP.shinymark.com:4443/" },
	{ Site_Name: "ERP", URL: "https://ERP.shinymark.com:4443/" },
	{ Site_Name: "HQ", URL: "https://HQ.shinymark.com:4443/" },
	{ Site_Name: "PH", URL: "https://PH.shinymark.com:4443/" },
	{ Site_Name: "BM", URL: "https://BM.shinymark.com:4443/" },
	{ Site_Name: "HW", URL: "https://HW.shinymark.com:4443/" },
	{ Site_Name: "PHI", URL: "https://PHI.shinymark.com:4443/" },
])
// {Site_Name:'TD', URL:'https://TD.shinymark.com:3443/'}],

onMounted(async () => {
	await Load_Menu_Info()
	await Load_Site_Switch()
})

const Load_Site_Switch = async () => {
	const param = {
		ProgramID: route.meta.ProgramID,
	}
	try {
		const response = await axios.post(
			`/api/Public/Common/Site_Switch`,
			param
		)
		Site_Switch_Flag.value = response.data.Site_Switch_Flag
    const strServer = location.host
		.toUpperCase()
		.substring(0, location.host.indexOf("."))

    switch(strServer) {
      case 'ADP':
        Site_Switch.value.forEach((item) => {
          item.Show_Flag = true;
        })
      break;
      case 'PHI':
        Site_Switch.value.forEach((item) => {
          item.Show_Flag = item.Site_Name == strServer ? true:false;
        })
      break;
      default:
        Site_Switch.value.forEach((item) => {
          item.Show_Flag = (item.Site_Name == 'ADP' || item.Site_Name == 'PHI') ? false:true;
        })
      break;
    }                

    
    Site_Switch.value.forEach(item => {
      item.CSSClass = item.Site_Name.toUpperCase() == strServer ? "menubox entity-site current-server" : "menubox entity-site"
      item.URL = item.URL + route.name
    })

	} catch (error) {
		// console.log(error);
	}
}

const Load_Menu_Info = async () => {
	const param = {
		ProgramID: route.meta.ProgramID,
	}
	try {
		const response = await axios.post(`/api/Public/Common/Shortcut_Menu`, param)
		Menu_Info.value = response.data
    Menu_Info.value.forEach(item => {
		item["data-window"] = `{mode:${item.Win_Mode ? item.Win_Mode : ""}, ${item.Link_Path},width:${item.Win_Width},height:${item.Win_Height},top:${item.Win_Top},left:${item.Win_Left},muilti-window:${item.Muilti_Win}}`
		item.CSSClass += item.ProgramID == route.meta.ProgramID ? " Current_Locat" : ""
	})    
	} catch (error) {
		console.log(error);
	}
}

const openWindow = async () => {
	event.preventDefault();
	event.stopPropagation();
	var oldcss = document.querySelectorAll("[class*=openwindow-selected]");
	for (item of oldcss) {
		item.className = item.className.split(" ").filter(c => !c.startsWith("openwindow-selected")).join(" ").trim();
	}

	let _data = event.currentTarget.dataset.window;
	let _mode = null;
	if (_data.toLowerCase().indexOf('mode') >= 0 && _data.toLowerCase().replace(/:|'|"/g, '').match('mode[^,}]+[^,}]') != null) { _mode = (_data.toLowerCase().indexOf('mode') >= 0 && _data.toLowerCase().replace(/:|'|"/g, '').match('mode[^,}]+[^,}]').toString().replace('mode', '')); }
	let _url = (_data.indexOf('url') >= 0 && _data.match('url[^,}]+[^,}]').toString().replace('url:', ''));
	if (window.location.hostname === 'localhost') { _url = window.location.origin + _url }
	else {
		_url = (_data.toLowerCase().indexOf('aspnet') >= 0) ? 'https://' + window.location.hostname + _url : _url;
		_url = (_data.toLowerCase().indexOf('webpack') >= 0) ? 'https://' + window.location.hostname + ':3443' + _url : _url;
		_url = (_data.toLowerCase().indexOf('vite') >= 0) ? 'https://' + window.location.hostname + ':4443' + _url : _url;
	}
	let _isreport = (_data.toLowerCase().indexOf('report:') >= 0) ? true : false;
	let _report = (_data.toLowerCase().indexOf('report:') >= 0 && _data.toLowerCase().replace(/:|'|"/g, '').match('report[^,}]+[^,}]').toString().replace('report', '') === 'landscape') ? 'landscape' : 'portrait';
	let _width = (_data.toLowerCase().indexOf('width:') >= 0) ? parseInt(_data.toLowerCase().replace(/:/g, '').match('width[0-9]+').toString().replace('width', '')) : 0;
	let _height = (_data.toLowerCase().indexOf('height:') >= 0) ? parseInt(_data.toLowerCase().replace(/:/g, '').match('height[0-9]+').toString().replace('height', '')) : 0;
	let _top = (_data.toLowerCase().indexOf('top:') >= 0) ? parseInt(_data.toLowerCase().replace(/:/g, '').match('top[0-9]+').toString().replace('top', '')) : 0;
	let _left = (_data.toLowerCase().indexOf('left:') >= 0) ? parseInt(_data.toLowerCase().replace(/:/g, '').match('left[0-9]+').toString().replace('left', '')) : 0;
	let _button_print = (_data.toLowerCase().indexOf('button-print') >= 0 && _data.toLowerCase().replace(/:|'|"/g, '').match('button-print[^,}]+[^,}]').toString().replace('button-print', '') == 'true') ? 'flix' : 'none';
	let WINDOW_NAME = (event.currentTarget.getAttribute("title") != undefined) ? event.currentTarget.getAttribute("title") : ' ';

	let data = {
		url: _url,
		isreport: _isreport,
		report: _report,
		width: _width,
		height: _height,
		top: _top,
		left: _left,
		button_print: _button_print,
		WINDOW_NAME: WINDOW_NAME,
		winname: 'WINDOW_NAME'
	};

	const _hour = new Date().getHours();
	let hourchr = (_hour < 9) ? '' : '-' + _hour;
	if (event.currentTarget.closest('td') !== null && _url != false) { event.currentTarget.closest('td').classList.add('openwindow-selected' + hourchr); event.currentTarget.classList.add('openwindow-selected'); };

	switch (_mode) {
		case 'sidewindow': openSideWindow(data); break;
		case 'dialogwindow': openDialogWindow(data); break;
		case 'newwindow': openNewWindow(data); break;
		default: if (_url != false) { window.open(_url, 'SUBFORM'); }//default: if (_url != false) { window.location.href = _url; }
	}
};
</script>
