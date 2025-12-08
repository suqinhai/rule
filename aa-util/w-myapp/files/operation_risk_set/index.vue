<template>
    <!-- 运营中心-优惠活动列表-活动风险配置 -->
    <div class="container operation-risk-set">
        <el-form class="filter-form" inline :model="state.formData">
			<el-form-item :label="$t('站点:')" v-if="commonData.merchantSiteList.length > 1">
			    <MerchantSiteSelect isNeedDefault :clearable="false" v-model="state.formData.merchantId">
			    </MerchantSiteSelect>
			</el-form-item>
			<el-form-item :label="$t('类型:')">
			    <el-select class="select-box" clearable v-model="state.formData.type" :placeholder="$t('请选择类型')" @change="state.formData.condition = ''">
			        <el-option v-for="item in state.marketType" :key="item.value" :label="item.label" :value="item.value" />
			    </el-select>
			</el-form-item>
			<el-form-item :label="$t('条件:')">
			    <el-select class="select-box" clearable v-model="state.formData.condition" :placeholder="$t('请选择条件')">
			        <el-option v-for="item in conditionList" :key="item.value" :label="item.label" :value="item.value" />
			    </el-select>
			</el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">{{$t('搜 索')}}</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">{{$t('重 置')}}</el-button>
            </el-form-item>
			<el-form-item>
				<el-icon class="pointer" :size="24" @click="state.showExplain = true">
				    <QuestionFilled />
				</el-icon>
			</el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border :row-class-name="({row}) => (row.isTotal ? 'total-row' : '')">
        	<el-table-column prop="type_" :label="$t('类型')" min-width="140" align="center" />
        	<el-table-column prop="condition_" :label="$t('条件')" min-width="140" align="center" />
        	<el-table-column prop="layerNames" :label="$t('参与层级')" min-width="140" align="center" />
        	<el-table-column prop="levelNames" :label="$t('参与vip')" min-width="140" align="center" />
        	<el-table-column prop="agentIds" :label="$t('指定代理ID')" min-width="140" align="center" />
        	<el-table-column prop="channelNames" :label="$t('指定渠道')" min-width="140" align="center" />
        	<el-table-column prop="domains" :label="$t('指定网址')" min-width="140" align="center" />
        	<el-table-column :label="$t('仅限H5')" min-width="140" align="center">
				<template #default="{ row }">
			        {{ row.collectLimit && row.collectLimit.split(',').includes('1') ? $t('已选择') : ''  }}
			    </template>
			</el-table-column>
        	<el-table-column :label="$t('仅限android-app领奖')" min-width="140" align="center">
				<template #default="{ row }">
			        {{ row.collectLimit && row.collectLimit.split(',').includes('2') ? $t('已选择') : ''  }}
			    </template>
			</el-table-column>
        	<el-table-column :label="$t('仅限ios-app领奖')" min-width="140" align="center">
				<template #default="{ row }">
			        {{ row.collectLimit && row.collectLimit.split(',').includes('3') ? $t('已选择') : ''  }}
			    </template>
			</el-table-column>
        	<el-table-column :label="$t('禁止同IP重复登录')" min-width="140" align="center">
				<template #default="{ row }">
			        {{ row.collectLimit && row.collectLimit.split(',').includes('4') ? $t('已选择') : ''  }}
			    </template>
			</el-table-column>
        	<el-table-column :label="$t('禁止同设备号重复领取')" min-width="140" align="center">
				<template #default="{ row }">
			        {{ row.collectLimit && row.collectLimit.split(',').includes('5') ? $t('已选择') : ''  }}
			    </template>
			</el-table-column>
        	<el-table-column :label="$t('已绑定收款方式')" min-width="140" align="center">
				<template #default="{ row }">
			        {{ row.collectLimit && row.collectLimit.split(',').includes('6') ? $t('已选择') : ''  }}
			    </template>
			</el-table-column>
        	<el-table-column :label="$t('已绑定手机号码')" min-width="140" align="center">
				<template #default="{ row }">
			        {{ row.collectLimit && row.collectLimit.split(',').includes('7') ? $t('已选择') : ''  }}
			    </template>
			</el-table-column>
        	<el-table-column :label="$t('设置姓名')" min-width="140" align="center">
				<template #default="{ row }">
			        {{ row.collectLimit && row.collectLimit.split(',').includes('8') ? $t('已选择') : ''  }}
			    </template>
			</el-table-column>
        	<el-table-column :label="$t('已绑定邮箱')" min-width="140" align="center">
				<template #default="{ row }">
			        {{ row.collectLimit && row.collectLimit.split(',').includes('9') ? $t('已选择') : ''  }}
			    </template>
			</el-table-column>
        	<el-table-column :label="$t('已绑定facebook')" min-width="140" align="center">
				<template #default="{ row }">
					{{ row.collectLimit && row.collectLimit.split(',').includes('10') ? $t('已选择') : ''  }}
				</template>
			</el-table-column>
			<el-table-column :label="$t('已绑定telegram')" min-width="140" align="center">
				<template #default="{ row }">
					{{ row.collectLimit && row.collectLimit.split(',').includes('11') ? $t('已选择') : ''  }}
				</template>
			</el-table-column>
			<el-table-column :label="$t('已绑定WhatsApp')" min-width="140" align="center">
				<template #default="{ row }">
					{{ row.collectLimit && row.collectLimit.split(',').includes('12') ? $t('已选择') : ''  }}
				</template>
			</el-table-column>
        	<el-table-column fixed="right" :label="$t('操作')" width="180" align="center">
        	    <template #default="{ row }">
        	        <div class="table_operateBtn">
        	            <el-button v-throttle text type="primary" @click="handleEidt(row)">{{$t('修改')}}</el-button>
        	        </div>
        	    </template>
        	</el-table-column>
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:limit="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="fetchData"></Pagination>
		<EditDialog :itemData="state.itemData" v-if="state.showEditDialog" @close="state.showEditDialog = false" @fetchData="fetchData"></EditDialog>
		<ExplainDialog v-if="state.showExplain" @close="state.showExplain = false"></ExplainDialog>
    </div>
</template>

<script setup name="operationRiskSet">
import { reactive, onMounted, defineAsyncComponent, computed } from 'vue'
import { getRiskConfigList } from "@/api/discounts_center.js"
import commonStore from '@/store/common'
import { getCommonMeta } from "@/api/common.js"
import { deepClone } from "@/common/util/index"

const EditDialog = defineAsyncComponent(() => import("./components/EditDialog.vue"));
const ExplainDialog = defineAsyncComponent(() => import("./components/ExplainDialog.vue"))

const commonData = commonStore()
const state = reactive({
    formData: {},
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
	itemData: {},
	showEditDialog: false,
	marketType: [],
	condition: []
})

const conditionList = computed(()=>{
	return state.condition.filter((item)=>{ return item.type ==  state.formData.type})
})

onMounted(() => {
     fetchData()
})

getCommonMeta({ types: "marketType" }).then(({ status, data }) => {
	if (status === 'OK' && data) {
		state.marketType = data.marketType || []
	}
})

const fetchData = (val = '') => {
	if (val) {
	    state.listQuery._page = 1
	    if (val === 'reset') {
	        state.formData = {
	            merchantId: commonData.currentMerchantSite.id
	        }
	    }
	}
    let params = { ...state.listQuery, ...state.formData }
    globalVBus.$emit('globalLoading', true)
    getRiskConfigList(params).then(res => {
		state.condition = deepClone(res.data.map((item)=>{ return {value:item.condition, label: item.condition_, type: item.type}})) 
		if(state.formData.type) { res.data = res.data.filter((item)=>{ return item.type ==  state.formData.type }) }
		if(state.formData.condition) { res.data = res.data.filter((item)=>{ return item.condition ==  state.formData.condition }) }
		res.data.forEach((item)=>{
			item.merchantId = state.formData.merchantId
		})
		state.tableData = res.data
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        if (!params.isExport) state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

const handleEidt = (data)=>{
	state.itemData = data
	state.showEditDialog = true
}

</script>

<style lang="scss" scoped>
.operation-risk-set {
}
</style>
