<template>
    <NuxtLayout>
      <section class="flex flex-col p-2 bg-[#E7EBEE] gap-y-2">
       
        <div class="flex items-center justify-center gap-y-3 bg-white rounded-lg min-h-[70vh]">
          <div class="p-10 text-center flex items-center justify-center">
            <div>
               <!-- <img alt="error"
                src="~/assets/img/nofound.svg"
                class="w-[180px] h-auto mx-auto mb-7"
              /> -->
  
              <h1 class="text-3xl md:text-6xl font-bold mb-4">{{ error.statusCode }}</h1>
              
              <h1 class="text-xl font-bold mb-8 max-w-[450px] mx-auto text-center">{{ error.message }}</h1>
              
             
                <button @click="handleError"
                  class="text-white bg-primary-500 px-6 py-2.5 rounded-lg hover:bg-primary-500/80 capitalize flex items-center  w-max mx-auto gap-x-2"
                >
               <AppIcon name="home" class="w-4 h-4" />   go  home
                </button>
             
            </div>
          </div>
        </div>
    
      </section>
    </NuxtLayout>
  </template>
  
  <script setup>
  const error = useError();

  const handleError = () => {
    clearError({
      redirect: '/',
    });
  };
  </script>
  