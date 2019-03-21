<template>
    <div class="home">
        <HeadNav></HeadNav>
        <div class="left-fixed-right-auto">
            <LeftMenu></LeftMenu>
             <div class="content_page" 
                :style="{'margin-left':'183px',
                    'width':this.win_size.width+'px',
                    'height':this.win_size.height+'px'}">
                <div class="content">
                    <router-view></router-view>
                </div>
             </div>
        </div>
    </div>
</template>
<script>
    import HeadNav from './HeadNav.vue';
    import LeftMenu from './LeftMenu.vue';

    export default {
        name: 'home',
        components: {
            HeadNav, LeftMenu
        },
        data(){
            return {
                win_size: {
                   height: '',
                   width:'',
                },
            }
        },
        methods: {
            //用于自适配窗口页面大小
            setSize() {
                //lib_$-->$,window的宽,高的获取是没有问题的。
                this.win_size = {
                    height:document.body.clientHeight-73,
                    width:document.body.clientWidth-183
                }
                //将content部分的宽高，存入store中，
                // this.$store.dispatch('set_win_content',this.win_size); //触发动作，content部分的宽高也随即改变。
            },
        },
       created() {
            this.setSize();
            // console.log(this.win_size.height)
       },
       mounted (){
            window.onresize = () => {
                 this.setSize();
            }
       }
    }
</script>
<style scoped>
    .content_page{
        position: fixed;
        top:71px;
        overflow:auto;
    }
     .content{
       width:100%;
       /* height:100%; */
    }
    .home{
        width:100%;
       height:100%;
    }
</style>
