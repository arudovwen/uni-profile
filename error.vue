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
  
              <!-- <h1 class="text-4xl md:text-8xl font-bold mb-8">{{ error.statusCode }}</h1> -->
              
              <h1 class="text-3xl font-bold mb-8 max-w-[450px] mx-auto text-center">{{ error.message }}</h1>
              
             
                <button @click="handleError"
                  class="text-white bg-primary-500 px-6 py-4 rounded-full hover:bg-primary-500/80 uppercase"
                >
                  go back home
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
  