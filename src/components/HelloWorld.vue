<script setup>
import { ref, onMounted } from 'vue'
import { getFriends, assignFriend, saveFriends } from '../actions/index.ts'

const opciones = ref([])

const friendsData = ref({})
onMounted(async () => {
  const friends = await getFriends()
  friendsData.value = friends
  opciones.value = Object.keys(friends)
})

const selectedValue = ref('')
const loadingMessage = ref('')
const disableCloseModal = ref(true)


// Estado para controlar la visibilidad
const mostrarModal = ref(false)

// Nombre del amigo que mostraremos (ejemplo para tu proyecto)
const amigoRevelado = ref('')


const abrirModal = async () => {
  disableCloseModal.value = true
  const name = selectedValue.value.toLowerCase()
  const isAlreadyAssigned = friendsData.value[name]

  if (!!isAlreadyAssigned) {
    amigoRevelado.value = "Ya te asignaron amigo, si te olvidaste preguntale a PELBA.... CORNUDO OLVIDADISO"
    mostrarModal.value = true
    disableCloseModal.value = false
    return
  }
  const assignedFriend = assignFriend(name, friendsData.value)
 
  amigoRevelado.value = assignedFriend.toUpperCase()
  mostrarModal.value = true
  
  await saveFriends(name, assignedFriend)
  friendsData.value = {...friendsData, [name]: assignedFriend}
  disableCloseModal.value = false
}

const closeModal = () => {
  mostrarModal.value = false
  amigoRevelado.value = ""
}


</script>

<template>
  <div class="card">
    <h3>Quien sos?</h3>
    <div v-if="!opciones.length">CARGANDO....</div>
    <div v-if="opciones.length" class="grid">
      <div v-for="opt in opciones" :key="opt" class="item">
        <input type="radio" :id="opt" :value="opt" v-model="selectedValue" />
        <label class="opt-label" :for="opt">{{ opt }}</label>
      </div>
    </div>


    <p v-if="selectedValue" class="feedback">
      Has marcado: <strong>{{ selectedValue }}</strong>
    </p>
    <button :disabled="!selectedValue || !friendsData" class="btn-enviar" @click="abrirModal()">Revelar Amigo</button>
    <Teleport to="body">
      <div v-if="mostrarModal" class="modal-overlay" @click.self="mostrarModal = false">
        <div class="modal-content">
          <h3 class="nombre-revelado">🎁 ¡Tu Amigo Invisible es!</h3>
          <p class="nombre-revelado">{{ amigoRevelado }}</p>
          
          <button :disabled="disableCloseModal" class="btn-cerrar" @click="mostrarModal = false">Cerrar</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.item { display: flex; align-items: center; gap: 10px; }
.card { border: 1px solid #ddd; padding: 20px; border-radius: 12px; }
.contenedor {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 15px;
  background: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.grid-opciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 20px 0;
}

.tarjeta-opcion {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: white;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tarjeta-opcion:hover {
  border-color: #42b883;
}

.tarjeta-opcion.activa {
  border-color: #42b883;
  background-color: #f0fff4;
}

.btn-enviar {
  width: 100%;
  padding: 12px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-enviar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.feedback {
  margin-top: 15px;
  color: #666;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* Caja blanca del modal */
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  min-width: 300px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.nombre-revelado {
  font-size: 2rem;
  font-weight: bold;
  color: #42b883;
  margin: 20px 0;
}

.btn-cerrar {
  background: #ff4757;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cerrar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.opt-label { 
  text-transform: capitalize;
}

</style>