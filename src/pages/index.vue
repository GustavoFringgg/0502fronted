<template>
  <div>
    <div class="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-8 lg:px-8">
      <h2 class="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
        Index Page
        <br />
        <span class="text-indigo-600">Vite + Vue 3 + TypeScript + Tailwind CSS(with daisyUI)</span>
      </h2>
      <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex rounded-md shadow">
          <router-link
                       to="/"
                       class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none">
            Back Home
          </router-link>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-screen-xl text-gray-900" style="padding:10px">
      <div class="main_menu">
        <ul>Sales</ul>
        <li>
          <a href="/Customer_List">Customer List</a>
        </li>
      </div>
      <div class="main_menu">
        <ul>Production</ul>
        <li>
          <a href="/Manufacturer_List">Manufacturer List</a>
        </li>
      </div>
      <div class="main_menu">
        <ul>Public</ul>
        <li>
          <a href="/Knowledge/56/61/">Knowledge</a>
        </li>
        <li>
          <a href="/Tutor/56/61/?">Tutor</a>
        </li>
        <li>
          <a href="/Knowledge/56/61/false">Knowledge Detail</a>
        </li>
      </div>
      <div class="main_menu">
        <ul>System</ul>
        <li>
          <a href="/Organization_List">Organization List</a>
        </li>
      </div>
    </div>
    <br>

    <div class="mx-auto max-w-screen-xl text-gray-900" style="clear:both;padding:10px">
      <ul class="list-disc">
        <li>program</li>
        <li>the best of both sides: vue3 and tailwind3</li>
        <li>nice and simpe start template for any website, with batteries included</li>
        <li>
          <HelloWorld msg=""></HelloWorld>
        </li>
        <li>see <code>src/pages/index.vue, src/components/pages/(work_area)/xxx.vue</code>
        </li>
      </ul>
    </div>
    <br>

  </div>
</template>
<style scoped>
.main_menu {
  display: inline-block;
  padding: 10px;
}

.main_menu ul {
  font-size: 18px;
}
</style>
