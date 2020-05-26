<template>
    <div class="full">
        <div class="headerDiv marginWidth clearfix">
            <div class="headerLeft">
                <div class="clearfix imgBox flexSafari">
                    <img src="../assets/images/logo.png" alt="logo">
                    <div class="titleH">万才网</div>
                </div>
            </div>
            <div class="headerRight">
                <div class="logDiv flexSafari">
                    请登录
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ahead"
};
</script>
<style scoped>
.headerLeft {
    float: left;
    text-align: cener;
    position: relative;
    /* line-height: 10%; */
    /* height:30% */
    height: 56px;
}
.headerRight {
    float: right;
    display: flex;
    justify-content: flex-end;
    width: 300px;
    height: 56px;
    align-items: center;
    
}
.titleH {
    font-size: 24px;
    color: #e84518;

    line-height: 100%;
    text-align: center;
    margin-left: 24px;
}
.full {
    width: 100%;
}
.headerDiv {
    width: 70%;
    padding: 10px 0;
   min-height: 56px;
    min-width:1200px;
}
.imgBox {
    display: flex;
    justify-content: flex-start;
    width: 300px;
    height: 100%;
    align-items: center;
}
.logDiv{
    font-size: 16px;
	color: #262626;
    line-height: 56px;
    text-align: center;
    height:100%
}
</style>
