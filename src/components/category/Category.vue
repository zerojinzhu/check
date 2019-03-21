<template>
  <div class="category">
    <CategoryNav v-on:getCategory="getCategory"></CategoryNav>
    <DevicesTable :categoryId="categoryId" ></DevicesTable>
  </div>
</template>

<script>
import CategoryNav from './CategoryNav.vue';
import DevicesTable from './DevicesTable.vue';
export default {
  name: 'Category',
  components: {
      CategoryNav,DevicesTable
  },
  data () {
    return {
      categoryId: "",
      currentStatus: "",
      nextCheckDate: ""
    }
  },
  methods: {
    getCategory(categoryId, status, nextCheckDate){
      if(categoryId) {this.categoryId = categoryId;}
    }
  },
  mounted() {

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
