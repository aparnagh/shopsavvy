<script setup lang="ts">
import { onMounted, ref, defineProps } from "vue";
import { Icon } from "@iconify/vue";
import { Loader } from "@googlemaps/js-api-loader";
import { useSidebarStore } from "@/stores/SidebarStore";
import { useAccountStore } from "@/stores/AccountStore";
import { useCartStore } from "@/stores/CartStore";
import { useStoreLocationStore } from "@/stores/StoreLocationStore";

const sidebarStore = useSidebarStore();
const accountStore = useAccountStore();
const cartStore = useCartStore();
const storeLocationStore = useStoreLocationStore();

const props = defineProps<{
  cartTotal: number;
}>();

const fuelCost = ref(0);
const tripDistance = ref(0);
const tripCalculated = ref(false);

onMounted(() => {
  const loader = new Loader({
    apiKey: "AIzaSyAhDm2vvcL2qShVrr83pmxu03Wv-CEkJoU",
    version: "weekly",
  });

  loader.load().then(async () => {
    /* eslint-disable */
    const { Map } = (await google.maps.importLibrary(
      "maps"
    )) as google.maps.MapsLibrary;
    const map = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 37.2296, lng: -80.4139 },
      zoom: 8,
    });

    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();

    directionsRenderer.setMap(map);

    // only push the stores that are being visited
    let wypts = [] as google.maps.DirectionsWaypoint[];
    cartStore.getStoresToVisit().forEach((storeName) => {
      wypts.push({
        location: storeLocationStore.getStoreLocation(storeName),
        stopover: true,
      });
    });

    // set up the input for autocomplete
    const { Autocomplete } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;
    const input = document.getElementById(
      "start-address-input"
    ) as HTMLInputElement;
    const autocomplete = new Autocomplete(input, {
      types: ["address"],
      fields: ["formatted_address"],
    });

    google.maps.event.addListener(autocomplete, "place_changed", () => {
      const place = autocomplete.getPlace() as google.maps.places.PlaceResult;
      const formattedAddress =
        place.formatted_address ||
        "903 University City Blvd, Blacksburg, VA 24060";

      // calculte and display the route
      directionsService.route(
        {
          origin: formattedAddress,
          destination: formattedAddress,
          waypoints: wypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response) => {
          directionsRenderer.setDirections(response);

          // get the total distance
          let totalDist = 0;
          response?.routes[0].legs.forEach((leg) => {
            if (leg.distance) {
              totalDist += parseFloat(
                leg.distance.text.substring(0, leg.distance.text.length - 3)
              );
            }
          });
          tripDistance.value = totalDist;

          // calculate total gas cost
          const gasPrice = 3.48;
          const mpg = accountStore.account.gasMileage || 24;
          const totalGasPrice = (totalDist / mpg) * gasPrice;
          fuelCost.value = totalGasPrice;

          tripCalculated.value = true;
        }
      );
    });
    // -----------------------
  });
});
</script>

<style scoped>
.sidebar {
  height: 100%;
  width: 19em;
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  background-color: var(--light-grey);
  overflow-x: hidden;
  padding: 3em 1em 1em 1em;
  box-shadow: 0px 3px 5px #0005;
  display: flex;
  flex-direction: column;
  gap: 1em;
  transition: 0.3s ease;
  font-size: 0.9em;
}
.collapsed {
  opacity: 0;
  transform: translateX(17em);
}
.close-button {
  position: absolute;
  top: 0.25em;
  left: 0.25em;
  font-size: 2em;
}
.close-button:hover {
  color: rgba(0, 0, 0, 0.5);
}
.label-val {
  display: flex;
  justify-content: space-between;
}
.line-sep {
  height: 2px;
  background-color: gray;
}
.trip-cost {
  color: var(--tertiary-color-dark);
  font-weight: bold;
  font-size: 1.15em;
}
#map {
  height: 14em;
  z-index: 2;
}
#start-address-input {
  padding: 0.25em 0.5em;
  width: 100%;
  margin-top: 0.5em;
  margin-bottom: 1em;
  border: 1px solid #5a5a5a;
  outline: none;
  border-radius: 0.25em;
}
.trip-info {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="sidebar" :class="{ collapsed: sidebarStore.collapsed }">
    <Icon
      class="close-button"
      icon="material-symbols:close-rounded"
      @click="sidebarStore.toggleSidebar"
    />
    <div id="map"></div>
    <label>Start address: <input id="start-address-input" type="text" /></label>
    <Transition>
      <div class="trip-info" v-if="tripCalculated">
        <div class="label-val">
          <span>Car MPG</span>
          <span>{{ accountStore.account.gasMileage || "24" }}</span>
        </div>
        <div class="label-val">
          <span>Distance</span>
          <span>{{ tripDistance.toFixed(1) }} miles</span>
        </div>
        <div class="line-sep"></div>
        <div class="label-val">
          <b>Fuel Cost</b>
          <b>${{ fuelCost.toFixed(2) }}</b>
        </div>
        <div class="label-val">
          <span>Cart Total</span>
          <span>${{ cartTotal.toFixed(2) }}</span>
        </div>
        <div class="line-sep"></div>
        <div class="label-val trip-cost">
          <span>Trip Cost</span>
          <span>${{ (cartTotal + fuelCost).toFixed(2) }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>
