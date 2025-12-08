<template>
	<div class="content-edit" :class="[onlyView ? 'onlyView' : '']" :style="{...styleCustom}">
		<el-form ref="deployForm" :rules="state.rules" :model="state.formData" :disabled="onlyView" :label-width="$locale == 'zh' ? 'auto' : '120px'">
			<div class="title" v-if="onlyView">{{$t('运营风险设置')}}</div>
			<el-form-item :label="$t('会员层级:')" prop="fixLayerList">
				<div style="width: 100%">
					<el-checkbox v-model="state.formData.isCheckedAllLayer" :indeterminate="state.formData.isIndeterminateLayer"
						@change="(val) => checkChange(val,'memberLevel','id','fixLayerList','isIndeterminateLayer',1)">{{$t('全部层级')}}</el-checkbox>
				</div>
				<el-checkbox-group v-model="state.formData.fixLayerList"
					@change="(val) => checkChange(val,'memberLevel','id','isCheckedAllLayer','isIndeterminateLayer',0)">
					<el-checkbox v-for="item in state.memberLevel" :key="item" :value="item.id" :label="item.id">{{ item.name }}
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item :label="$t('会员等级:')">
				<el-checkbox v-model="state.formData.isCheckedAllLevel" :indeterminate="state.formData.isIndeterminateLevel"
					@change="(val) => checkChange(val,'userLevel','value','levelList','isIndeterminateLevel',1)">{{$t('全部等级')}}</el-checkbox>
				<el-checkbox-group v-model="state.formData.levelList"
					 @change="(val) => checkChange(val,'userLevel','value','isCheckedAllLevel','isIndeterminateLevel',0)">
					<el-checkbox v-for="item in state.userLevel" :key="item" :value="item.value" :label="item.value">{{ item.label }}
					</el-checkbox>
				</el-checkbox-group>
				<div>{{$t('说明：会员层级和vip等级都勾选，则需要同时满足才可参与；')}}</div>
			</el-form-item>
			<el-form-item :label="$t('领奖设备:')">
				<el-checkbox-group v-model="state.formData.collectLimit">
					<el-checkbox style="white-space: pre-wrap;width:220px" v-for="item in state.marketCollectLimit" :key="item" :value="item.value" :label="item.value">{{ item.label }}
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item :label="$t('设备限制:')" v-if="![20].includes(+props.itemData.condition)">
				<el-checkbox-group v-model="state.formData.collectLimit">
					<el-checkbox style="white-space: pre-wrap;width:220px"  v-for="item in state.marketDeviceLimit" :key="item" :value="item.value" :label="item.value">{{ item.label }}
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item :label="$t('绑定限制:')">
				<el-checkbox-group v-model="state.formData.collectLimit">
					<el-checkbox style="white-space: pre-wrap;width:220px"  v-for="item in state.marketBindLimit" :key="item" :value="item.value" :label="item.value">{{ item.label }}
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item :label="$t('指定代理/渠道:')" v-if="![20].includes(+props.itemData.condition)">
				<el-checkbox v-model="state.formData.agantOrChannel">{{$t('已选择')}}
				</el-checkbox>
				<template v-if="state.formData.agantOrChannel">
					<div></div>
					<el-radio-group v-model="state.formData.agantOrChannelSelect">
						<el-radio :label="1">{{$t('指定代理ID（限制顶级）')}}</el-radio>
						<el-radio :label="2">{{$t('指定渠道')}}</el-radio>
					</el-radio-group>
					<el-form-item :label="$t('指定代理ID（限制顶级）')" v-if="state.formData.agantOrChannelSelect === 1">
						<el-input v-model="state.formData.agentIds"></el-input>
					</el-form-item>
					<el-form-item :label="$t('指定渠道:')" v-if="state.formData.agantOrChannelSelect === 2">
						<el-select v-model="state.formData.channelIds" :placeholder="$t('请选择渠道')" multiple>
							<el-option v-for="item in state.channelList" :key="item.id" :label="item.name" :value="item.id.toString()" />
						</el-select>
					</el-form-item>
				</template>
			</el-form-item>
			<el-form-item :label="$t('指定网址:')" v-if="![20,21].includes(+props.itemData.condition)">
				<el-select v-model="state.formData.domains" :placeholder="$t('请选择网址')" multiple>
					<el-option v-for="item in state.domainList" :key="item.name" :label="item.name" :value="item.name" />
				</el-select>
			</el-form-item>
		</el-form>
		<div class="special pointer" v-if="onlyView" @click="router.push({path:'/operating-center/operation-risk-set'})">{{$t('请前往：‘运营风险设置’修改配置')}}</div>
	</div>
</template>
<script setup>
import { ref, reactive, onMounted, defineExpose, computed } from 'vue'
import { useRouter } from 'vue-router'
import { postEditRiskConfig, getRiskConfigSingle } from "@/api/discounts_center.js"
import { getCommonMeta, getLevelConfig, getUserGradeData } from "@/api/common.js"
import { getDomainListData } from '@/api/app_and_domain_manage'
import { getChannelListData } from '@/api/data_center.js'
import { number } from 'echarts'

const router = useRouter()
const deployForm = ref(null)
const state = reactive({
    formData: {
		item: 1
	},
	marketType: [],
	marketCollectLimit: [],
	marketDeviceLimit: [],
	marketBindLimit: [],
	memberLevel: [],
	userLevel: [],
	domainList: [],
	channelList: []
})

const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {};
        },
    },
	// 只查看
	onlyView: {
		type: Boolean,
		default: () => {
		    return true;
		},
	},
	styleCustom: {
        type: Object,
        default: () => {
            return {};
        },
    },
})

onMounted(async ()=>{
	await getLevelConfig({merchantId: props.itemData.merchantId}).then(res => {
	    state.memberLevel = res.data || []
	})
	await getUserGradeData({merchantId: props.itemData.merchantId}).then(({ data }) => {
	    if (data) {
	        for (let key in data) {
	            state.userLevel.push({
	                label: data[key],
	                value: key,
	            })
	        }
	    }
	})
	await getCommonMeta({ types: "marketType,marketCollectLimit,marketDeviceLimit,marketBindLimit", merchantId: props.itemData.merchantId }).then(({ status, data }) => {
	    if (status === 'OK' && data) {
	        state.marketType = data.marketType || []
			state.marketCollectLimit = data.marketCollectLimit || []
			state.marketDeviceLimit = data.marketDeviceLimit || []
			state.marketBindLimit = data.marketBindLimit || []
	    }
	})
	await getDomainListData({ _page: 1,_size: 999,forBack: 0,merchantId: props.itemData.merchantId}).then(res => {
	    state.domainList = res.data?.list || []
	})
	await getChannelListData({ _page: 1,_size: 999,merchantId: props.itemData.merchantId}).then((res)=>{
		state.channelList = res.data?.list || []
	})
	
	update()

})

const update = ()=>{
	getRiskConfigSingle({...props.itemData}).then((res)=>{
		state.formData = { ... res.data }
		let { layers, fixLayerList, levelList, levels, agentIds, channelIds  } = state.formData
		state.formData.fixLayerList = fixLayerList = (layers && layers.split(',').map((val)=> {return Number(val)})) || []
		state.formData.isCheckedAllLayer = fixLayerList.length == state.memberLevel.length
		state.formData.isIndeterminateLayer = fixLayerList.length > 0 && fixLayerList.length < state.memberLevel.length 
		state.formData.levelList = levelList = (levels && levels?.split(',')) || []
		state.formData.isCheckedAllLevel = state.userLevel.length == levelList.length
		state.formData.isIndeterminateLevel = levelList.length > 0 && state.userLevel.length > levelList.length
		state.formData.collectLimit = state.formData.collectLimit ? state.formData.collectLimit.split(',') : [],
		state.formData.channelIds = state.formData.channelIds ? state.formData.channelIds.split(',') : []
		if(agentIds || channelIds) { state.formData.agantOrChannel = true }
		if(agentIds) { state.formData.agantOrChannelSelect = 1 }
		if(channelIds) { state.formData.agantOrChannelSelect = 2 }
		state.formData.domains = state.formData.domains ? state.formData.domains.split(',') : []
	})
}

// 复选框勾选变化
const checkChange = (currentValue, metaKey, key, targetKey, indeterminateKey, type) => {
    checkboxChange({
        currentValue,
        metaKey,
		key,
        dependData: state.formData,
        targetKey,
        indeterminateKey,
        type
    })
}

// 复选框选择变化
const checkboxChange = ({ currentValue, metaKey, key, dependData, targetKey, indeterminateKey, type }) => {
    if (type === 1) {
        dependData[targetKey] = currentValue
            ? state[metaKey].map((item) => item[key])
            : [],
        dependData[indeterminateKey] = false
    } else {
        const checkedCount = currentValue.length;
        dependData[targetKey] = checkedCount === state[metaKey].length
        dependData[indeterminateKey] =
            checkedCount > 0 && checkedCount < state[metaKey].length
    }
}

const formData = computed(()=>{
	return state.formData
})

defineExpose({ formData, update })

</script>

<style lang="scss" scoped>
.title{
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
}
.onlyView{
	width: 370px;
	margin-left: 10px;
	background: #f7f7f7;
	padding: 20px;
}
</style>