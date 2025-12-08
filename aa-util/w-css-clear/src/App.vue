<template>
    <div class="ui-popup ui-popup--center safe-area-top safe-area-bottom ui-popover ui-popover--light" tabindex="0"
        style="width: fit-content; z-index: 2006; position: absolute; left: 14px; top: 158px; margin: 0px;"
        data-popper-placement="bottom-start" role="listbox" aria-label="国家/地区选择">
        <div class="ui-popover__content ui-popover__content--vertical">
            <div class="ui-select__options _dropdown_g8r6m_131">
                <div
                    class="_main_10sa6_62 lobby-scroll lobby-scroll--y lobby-scroll--system-scrollbar lobby-scroll--is-desktop ui-select__scroll">
                    <div v-for="option in options" :key="option.id" class="ui-options__option"
                        :class="{ 'ui-options__option--active': option.active }" role="option"
                        :aria-selected="option.active">
                        <span class="ui-options__option-content">
                            <div class="_item_g8r6m_134">
                                <img class="lobby-image lobby-image--skeleton _itemPrefix_g8r6m_142" data-status="success" data-thumb="0"
                                    :data-id="option.id" :src="option.flagSrc" :alt="option.name" loading="lazy" />
                                <span class="_itemText_g8r6m_147">{{ option.name }} ({{ option.code }})</span>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    const options = ref([
        {
            id: 'c4e1d645-e797-4418-af4f-25f2aa9e91bf',
            name: '中国',
            code: '+86',
            flagSrc: 'https://oss.tyf147.cc/country/nationalflag/ChineseMainland.png',
            active: true
        },
        {
            id: 'e0aa5a60-2bb2-4790-b19f-c1f363d12924',
            name: '阿拉伯联合酋长国',
            code: '+971',
            flagSrc: 'https://oss.tyf147.cc/country/nationalflag/UnitedArabEmirates.png',
            active: false
        }
    ])
</script>
<style scoped>
    
</style>