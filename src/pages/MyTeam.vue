<template>
    <!-- 我的团队 -->
    <div class="main-content my-team">
        <div v-for="(item, index) in myTeam" :key="index" class="team-item">
            <div class="team-first">
                <img class="first-img" :src="item.firstAgentPhoto" v-if="item.firstAgentPhoto" />
                <span class="first-img-bg" v-else></span>
                <div class="first-content">
                    <div class="first-phone">{{item.firstAgentPhone}}</div>
                    <div class="first-amount">{{'￥' + item.firstAgentAmount}}</div>
                </div>
            </div>
            <van-collapse v-model="item.activeNames">
                <van-collapse-item :name="idx" v-for="(child, idx) in item.list" :key="idx" class="team-second">
                    <div slot="title" class="second-no">
                        <span>二级代理</span>
                        <span class="second-no-right fl-r">{{item.secondAgentNo + '人'}}</span>
                    </div>
                    <div>
                        <div v-for="(second, i) in item.list[0]" :key="i" class="second-child">
                            <img class="second-img" :src="second.secondAgentPhoto" v-if="second.secondAgentPhoto" />
                            <span class="second-img-bg" v-else></span>
                            <div class="second-content">
                                <span class="second-phone">{{second.secondAgentPhone}}</span>
                                <span class="second-amount fl-r">{{'￥' + second.secondAgentAmount}}</span>
                            </div>
                        </div>
                    </div>
                </van-collapse-item>
            </van-collapse>
        </div>
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
            activeNames: ['0'],
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
                    firstAgentAmount: formatMoney(item.firstAgentAmount, 1),
                    activeNames: [],
                    list: []
                }
                itemObj.list[0] = item.list.map(child => {
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
        padding-top: 1rem;
        .team-item {
            background: #fff;
            padding: 1.2rem 1rem 0;
            margin-bottom: 1rem;
        }
        .team-first, .second-child {
            display: flex;
        }
        .second-child {
            padding: .6rem 0;
        }
        .first-img, .first-img-bg, .second-img, .second-img-bg {
            width: 3.1rem;
            height: 3.1rem;
            border-radius: 50%;
        }
        .second-img, .second-img-bg {
            width: 2.4rem;
            height: 2.4rem;
        }
        .first-img-bg, .second-img-bg {
            display: inline-block;
            background: $bgColor;
        }
        .first-content, .second-content {
            flex: 1;
            -webkit-box-flex: 1;
            flex-direction: row;
            overflow: hidden;
            margin-left: 1rem;
            line-height: 1;
            font-size: 1.6rem;
            color: $darkColor;
        }
        .second-content {
            font-size: 1.4rem;
            line-height: 2.4rem;
            margin-left: .8rem;
            color: #2B3842;
        }
        .second-amount {
            color: $themeColor;
            font-weight: 500;
        }
        .first-amount {
            font-size: 1.8rem;
            font-weight: 500;
            color: $themeColor;
            margin: 1.1rem 0 1.4rem;
        }
        .team-second .van-collapse-item__content {
            background: #FAFAFA;
            margin-bottom: 1.2rem;
            margin-bottom: 1.2rem;
            padding: .6rem 1.2rem;
            border-radius: 3px;
        }
        .second-no {
            height: 2.4rem;
            line-height: 2.4rem;
            font-size: 1.5rem;
            color: #2B3842;
        }
        .second-no-right {
            font-weight: 600;
        }
        .van-cell--clickable:active {
            background: #fff;
        }
    }
</style>