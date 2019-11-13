<template>
    <!-- 账单 -->
    <div class="main-content account-balance">
        <van-dropdown-menu class="account-balance-type" active-color="#FF7B31">
            <van-dropdown-item v-model="type" :options="typeList" @change="setType"/>
        </van-dropdown-menu>
        <van-list v-model="loading" :finished="finished"  finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item, index) in beillList" :key="index">
                <div class="bill-item">
                    <div class="bill-item-left">
                        <div class="bill-item-title">{{item.title}}</div>
                        <div class="bill-item-time">{{item.time}}</div>
                    </div>
                    <div class="bill-item-right">
                        <div :class="item.isPlus ? 'bill-item-amount theme-color' : 'bill-item-amount'">{{item.amountShow}}</div>
                        <!-- <div class="bill-item-status">{{item.status}}</div> -->
                    </div>
                </div>
            </van-cell>
        </van-list>
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
            type: 0,
            typeList: [{
                value: 0,
                text: '全部账单'
            }, {
                value: 1,
                text: '奖励金收益'
            }, {
                value: 2,
                text: '奖励金提取'
            }],
            pageNo: 0,
            pageSize: 10,
            beillList: [],
            loading: false,
            finished: false,
            total: 0
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
                type: this.type,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            // api.post(api.getUrl('agent-queryBills'), datas).then(res => {
            //     if (!!res && res.code === 0) {
            //         if (!!res.content && res.content.length > 0) {
            //             this.total = res.total
            //             res.content.forEach(item => {
            //                 let data = item
            //                 data.amount = formatMoney(item.amount, 1)
            //                 this.beillList.push(data)
            //             })
            //             this.loading = false
            //             if ((this.pageNo + 1)* this.pageSize >= this.total) {
            //                 this.finished = true
            //             }
            //         } else {
            //             this.finished = true
            //         }
            //     }
            // })
            const content = [{
                amount: -0,
                amountType: 1,
                status: '奖励金获取失败',
                time: '2019-11-11 09:00',
                title: '奖励金提取-建设银行(9989)'
            }, {
                amount: 110000,
                amountType: 1,
                status: '',
                time: '2019-11-11 09:00',
                title: '奖励金提取-建设银行(9989)'
            }, {
                amount: 0,
                amountType: 1,
                status: '奖励金获取失败',
                time: '2019-11-11 09:00',
                title: '奖励金提取-建设银行(9989)'
            }, {
                amount: 10,
                amountType: 1,
                status: '奖励金获取失败',
                time: '2019-11-11 09:00',
                title: '奖励金提取-建设银行(9989)'
            }, {
                amount: -100000,
                amountType: 1,
                status: '奖励金获取失败',
                time: '2019-11-11 09:00',
                title: '奖励金提取-建设银行(9989)'
            }, {
                amount: -10000,
                amountType: 1,
                status: '奖励金获取失败',
                time: '2019-11-11 09:00',
                title: '奖励金提取-建设银行(9989)'
            }, {
                amount: 10000,
                amountType: 1,
                status: '奖励金获取失败',
                time: '2019-11-11 09:00',
                title: '奖励金提取-建设银行(9989)'
            }]
            content.forEach(item => {
                let data = item
                data.isPlus = item.amount > 0 ? true : false
                data.amount = formatMoney(Math.abs(item.amount), 1)
                data.amountShow = item.amount > 0 ? '+' + data.amount : (item.amount == 0 ? data.amount : '-' + data.amount)
                this.beillList.push(data)
            })
            this.loading = false
        },
        // 上拉加载
        onLoad() {
            this.pageNo += 1
            this.getBill()
            if ((this.pageNo + 1)* this.pageSize >= this.total) {
                this.finished = true
            }
        }
    }
}
</script>

<style lang="scss">
    // @import '../assets/scss/index.scss';
    
</style>