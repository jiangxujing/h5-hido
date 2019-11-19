<template>
    <!-- 我的银行卡 -->
    <div class="main-content my-bank-card">
        <div v-if="request">
            <div v-for="(item, index) in bankCardList" :key="index" class="bank-item">
                <span class="bank-item-tips">借记卡</span>
                <img class="bank-item-bg" :src="item.bankBg" v-if="item.bankBg"/>
                <img class="bank-item-bg" src="../assets/images/myBankCard.png" v-else/>
                <div class="bank-item-content">
                    <img class="bank-item-photo" :src="item.bankPhoto">
                    <span>{{item.bankName}}</span>
                </div>
                <div class="bank-item-no">{{'**** **** **** ' + item.bankCardNo}}</div>
            </div>
            <img class="bank-item-add" src="../assets/images/addBankCard.png" @click="$router.push({name: 'addBankCard'})"/>
        </div>
    </div>
</template>

<script>
import { Toast, Collapse, CollapseItem } from 'vant'
import api from '../common/api.js'

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
        document.title = '银行卡'
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            api.setNative('callInit', {interceptBack: false})
            setTimeout(() => {
                this.getBankCardList()
            }, 600)
        } else {
            this.getBankCardList()
        }
    },
    computed: {

    },
    methods: {
        // 获取银行卡列表
        getBankCardList () {
            api.post(api.getUrl('agent-queryBindBankList'), {}).then(res => {
                if (!!res && res.code === 0) {
                    this.request = true
                    if (!!res.content && res.content.length > 0) {
                        this.bankCardList = res.content.map(item => {
                            let data = {}
                            data = item
                            return data
                        })
                    } else {
                        this.bankCardList = []
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">

</style>