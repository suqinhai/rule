<template>
    <!-- 运营中心-优惠活动列表-活动配置弹窗-活动说明 -->
    <Dialog top="2vh" :title="$t('说明')" width="820" :isShowBottomButton="false"
        @cancel="emits('close')">
        <div class="explain-box">
            <div class="small-box"
                v-for="(item,index) in explainData" :key="index">
                <span class="label">{{item.title}}</span>
                <span class="text">{{item.content}}</span>
            </div>
        </div>
    </Dialog>
</template>

<script setup>
const emits = defineEmits(["close"])

let explainData = [
	{ title: $t('功能说明：'), content: '' },
	{ title: '', content: $t('只有手动领取奖励才生效,自动领取不受这里条件设置影响，如充值配置为自动发放，则达到条件即可发放，不受此影响；') },
	{ title: $t('参与会员：'), content: '' },
	{ title: '', content: $t('会员层级：显示站点层级，包括手动和固定层级，系统默认全部选择；') },
	{ title: '', content: $t('vip等级：显示站点vip等级，系统默认全部选择；') },
	{ title: '', content: $t('勾选则表示可以参与该活动，取消勾选则不可参与该活动，且对会员不显示该活动') },
	{ title: '', content: $t('会员层级和vip等级需都勾选，需要同时满足才可参与，如勾选层级4，vip2时，会员满足层级4，但vip等级为1时，也不显示该任务和活动；') },
	{ title: '', content: $t('注：对充值相关活动，建议vip等级，层级全部勾选，避免出现未满足不显示该活动的问题；') },
	{ title: '', content: $t('特殊情况：会员未登录前，显示所有任务，活动，登录后则判断可参与条件对应隐藏') },
	{ title: $t('领取限制:'), content: '' },
	{ title: '', content: $t('禁止同设备号重复领取：若A用户领取了奖励，其他用户登录的设备号与A用户设备号相同，则其他用户不能领取奖励。') },
	{ title: '', content: $t('禁止同IP号重复领取：若A用户领取了奖励，其他用户的IP号与A用户IP号相同，则其他用户不能领取奖励。') },
	{ title: $t('指定代理渠道：'), content: '' },
	{ title: '', content: $t('系统判断存在配置指定代理和渠道时，该任务和活动只对指定的代理和渠道会员前端显示该任务和活动；未指定的成员均不显示；') },
	{ title: '', content: $t('指定代理ID：判断为顶级代理ID，可配置多个代理ID，多个用逗号隔开，提交后需要判断代理ID是否存在，最大配置上限50个；配置指定代理ID后，该代理链路下的会员则为有效用户；') },
	{ title: '', content: $t('指定渠道：下拉选择渠道，可多选；') },
]
</script>

<style lang="scss">
	.label{
		padding: 5px 0 2px 0;
		display: inline-block;
	}
	    
</style>
