<template>
	<!-- 运营中心-优惠活动列表-活动风险配置-修改 -->
	<Dialog width="700" ref="deployFormRef" :title="$t('修改')" top="10vh" @confirm="handleSubmit(deployFormRef)" @cancel="emits('close')">
		<ContentEdit :itemData="props.itemData" :onlyView="false" ref="contentEditRef"></ContentEdit>
	</Dialog>
</template>
<script setup>
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import { postEditRiskConfig } from "@/api/discounts_center.js"
import { deepClone } from "@/common/util/index"
import { ElMessage } from "element-plus"

const ContentEdit = defineAsyncComponent(() => import("@/views/operating_center/operation_risk_set/components/contentEdit.vue"));

const emits = defineEmits(["close", "fetchData"])
const deployFormRef = ref(null)
const contentEditRef = ref(null)

const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {};
        },
    },
})

const handleSubmit = ()=>{
	const params = deepClone(contentEditRef.value.formData)
	params.layers = params.fixLayerList && params.fixLayerList.length ? params.fixLayerList.join(",") : ''
	params.levels = params.levelList && params.levelList.length ? params.levelList.join(",") : ''
	params.collectLimit = params.collectLimit && params.collectLimit.length ? params.collectLimit.join(",") : ''
	params.channelIds = params.channelIds && params.channelIds.length ? params.channelIds.join(",") : ''
	params.domains = params.domains && params.domains.length ? params.domains.join(",") : ''
	if(!params.layers){ return ElMessage.warning($t('请选择会员层级'))}
	if(!params.levels){ return ElMessage.warning($t('请选择会员等级'))}
	// params.type = 1
	// params.condition = '1,1'
	if(!params.agantOrChannel){
		delete params.agentIds
		delete params.channelIds
	}
	if(params.agantOrChannelSelect === 1){ delete params.channelIds }
	if(params.agantOrChannelSelect === 2){ delete params.agentIds }
    params.merchantId = props.itemData.merchantId
	delete params.agantOrChannelSelect
	delete params.agantOrChannel
	delete params.levelList
	delete params.fixLayerList
	delete params.isCheckedAllLayer
	delete params.isIndeterminateLayer
	delete params.isCheckedAllLevel
	delete params.isIndeterminateLevel
	deployFormRef.value.showLoading()
	postEditRiskConfig(params).then(() => {
	    emits('close')
	    emits('fetchData')
		deployFormRef.value.closeLoading()
	}).catch(() => {
	    deployFormRef.value.closeLoading()
	})
}

</script>

<style lang="scss" scoped>
</style>