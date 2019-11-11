<template>
    <!-- 我的团队 -->
    <div class="main-content my-team">
        <!-- <div v-for="(item, index) in myTeam" :key="index">
            <div class="team-item">
                <div class="team-first"></div>
                <div class="team-second">
                    <van-collapse v-model="activeNames">
                        <van-collapse-item v-for="(child,idx) in item.list" :key="idx" :title="child.secondAgentPhone" :name="idx">
                            <div>child.secondAgentPhone</div>
                            <div>child.secondAgentAmount</div>
                        </van-collapse-item>
                    </van-collapse>
                </div>
            </div>
        </div>
        <van-collapse v-model="activeNames">
            <van-collapse-item v-for="(item,idx) in myTeam" :key="idx" :title="item.secondAgentPhone" :name="idx">
                <div>item.secondAgentPhone</div>
                <div>item.secondAgentAmount</div>
            </van-collapse-item>
        </van-collapse> -->

        <!-- <van-collapse v-model="activeNames">
            <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
            <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
            <van-collapse-item title="标题3" name="3" disabled>内容</van-collapse-item>
        </van-collapse> -->
    </div>
</template>

<script>
import { Toast, Collapse, CollapseItem } from 'vant'
import api from '../common/api.js'
import { formatMoney } from '../common/utils.js'

export default {
    name: 'my-team',
    data () {
        return {
            activeNames: ['1'],
            pageNo: 0,
            pageSize: 10,
            total: 0,
            myTeam: []
        }
    },
    mounted () {
        document.title = '我的团队'
        this.getMyTeam()
    },
    computed: {

    },
    methods: {
        // 获取团队信息
        getMyTeam () {
            const content = [{
                firstAgentAmount: 500000,
                firstAgentPhone: '131****7810(小明)',
                firstAgentPhoto: '',
                secondAgentNo: 5,
                list: [{
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }]
            }, {
                firstAgentAmount: 300000,
                firstAgentPhone: '131****7810(小明)',
                firstAgentPhoto: '',
                secondAgentNo: 3,
                list: [{
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }, {
                    secondAgentAmount: 100000,
                    secondAgentPhone: '131****7810',
                    secondAgentPhoto: ''
                }]
            }]

            this.myTeam = content.map(item => {
                let itemObj = {
                    firstAgentPhone: item.firstAgentPhone,
                    firstAgentPhoto: item.firstAgentPhoto,
                    secondAgentNo: item.secondAgentNo,
                    firstAgentAmount: formatMoney(item.firstAgentAmount, 1)
                }
                itemObj.list = item.list.map(child => {
                    let childObj = {
                        secondAgentPhone: child.secondAgentPhone,
                        secondAgentPhoto: child.secondAgentPhoto,
                        secondAgentAmount: formatMoney(child.secondAgentAmount, 1)
                    }
                    return childObj
                })
                return itemObj
            })
        }
    }
}
</script>

<style lang="scss">
    @import '../assets/scss/vant.scss';
    .my-team {

    }
</style>