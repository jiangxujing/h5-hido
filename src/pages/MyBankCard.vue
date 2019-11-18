<template>
    <!-- 我的银行卡 -->
    <div class="main-content my-bank-card">
        <div v-if="request">
            <div v-if="bankCardList && bankCardList.length > 0">
               
            </div>
            <div class="no-content" v-else>暂无银行卡</div>
        </div>
    </div>
</template>

<script>
import { Toast, Collapse, CollapseItem } from 'vant'
import api from '../common/api.js'
import { formatMoney } from '../common/utils.js'

export default {
    name: 'my-bank-card',
    data () {
        return {
            activeNames: ['0'],
            bankCardList: [],
            request: false
        }
    },
    mounted () {
        document.title = '我的银行卡'
        this.getBankCardList()
    },
    computed: {

    },
    methods: {
        // 获取银行卡列表
        getBankCardList () {
            this.request = true
            this.bankCardList = []
            // api.post(api.getUrl('agent-queryBindBankList'), {}).then(res => {
            //     if (!!res && res.code === 0) {
            //         this.request = true
            //         if (!!res.content && res.content.length > 0) {
            //             this.bankCardList = res.content.map(item => {
            //                 return item
            //             })
            //         } else {
            //             this.bankCardList = []
            //         }
            //     }
            // })
        }
    }
}
</script>

<style lang="scss">

</style>