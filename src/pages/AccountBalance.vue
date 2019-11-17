<template>
    <!-- 账单 -->
    <div class="main-content account-balance">
        <van-dropdown-menu class="account-balance-type" active-color="#FF7B31">
            <van-dropdown-item v-model="type" :options="typeList" @change="setType"/>
        </van-dropdown-menu>
        <!-- <van-list> -->
            <van-cell v-for="(item, index) in beillList" :key="index">
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
        <!-- </van-list> -->
    </div>
</template>

<script>
import { Toast, DropdownMenu, DropdownItem } from 'vant'
import { formatMoney } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'account-balance',
    data () {
        return {
            type: '00',
            typeList: [{
                value: '00',
                text: '全部账单'
            }, {
                value: '01',
                text: '奖励金收益'
            }, {
                value: '02',
                text: '奖励金提取'
            }],
            beillList: []
        }
    },
    mounted () {
        document.title = '账单'
        this.getBill()
    },
    computed: {

    },
    methods: {
        // 更改类型
        setType () {
            this.pageNo = 0
            this.getBill()
        },
        // 获取账单
        getBill () {
            let datas = {
                type: this.type
            }
            api.post(api.getUrl('agent-queryBills'), datas).then(res => {
                if (!!res && res.code === 0) {
                    if (!!res.content && res.content.length > 0) {
                        this.beillList = res.content.map(item => {
                            let data = item
                            data.isPlus = item.amount > 0 ? true : false
                            data.amountShow = item.amount > 0 ? '+' + formatMoney(Math.abs(item.amount), 1) : (item.amount == 0 ? '0.00' : '-' + formatMoney(Math.abs(item.amount), 1))
                            return data
                        })
                    } else {
                        this.beillList = []
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">
    
</style>