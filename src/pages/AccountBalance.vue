<template>
    <!-- 账单 -->
    <div class="main-content account-balance">
        <div v-if="request">
            <van-dropdown-menu class="account-balance-type" active-color="#FF7B31">
                <van-dropdown-item v-model="type" :options="typeList" @change="getBillList"/>
            </van-dropdown-menu>
            <div v-if="billList && billList.length > 0">
                <van-cell v-for="(item, index) in billList" :key="index">
                    <div class="bill-item">
                        <div class="bill-item-left">
                            <div class="bill-item-title">{{item.title}}</div>
                            <div class="bill-item-data">{{item.data}}</div>
                        </div>
                        <div class="bill-item-right">
                            <div :class="item.isPlus ? 'bill-item-amount theme-color' : 'bill-item-amount'">{{item.amountShow}}</div>
                            <!-- <div class="bill-item-status">{{item.status}}</div> -->
                        </div>
                    </div>
                </van-cell>
            </div>
            <div class="no-content" v-else>暂无奖励金</div>
        </div>
    </div>
</template>

<script>
import { formatMoney } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'account-balance',
    data () {
        return {
            type: '00',
            typeList: [{
                value: '00',
                text: '全部奖励'
            }, {
                value: '01',
                text: '奖励金收益'
            }, {
                value: '02',
                text: '奖励金提取'
            }],
            billList: [],
            request: false
        }
    },
    mounted () {
        document.title = '我的奖励金'
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            api.callHandler('callInit', {interceptBack: false})
            setTimeout(() => {
                this.getBillList()
            }, 600)
        } else {
            this.getBillList()
        }
    },
    computed: {

    },
    methods: {
        // 获取账单
        getBillList () {
            let datas = {
                type: this.type
            }
            api.post(api.getUrl('agent-queryBills'), datas).then(res => {
                if (!!res && res.code === 0) {
                    this.request = true
                    if (!!res.content && res.content.length > 0) {
                        this.billList = res.content.map(item => {
                            let data = item
                            data.isPlus = item.amount > 0 ? true : false
                            data.amountShow = item.amount > 0 ? '+' + formatMoney(Math.abs(item.amount), 1) : (item.amount == 0 ? '0.00' : '-' + formatMoney(Math.abs(item.amount), 1))
                            return data
                        })
                    } else {
                        this.billList = []
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">
    
</style>