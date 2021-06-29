<script>
  import { storage } from "$lib/auth";
  import { onMount } from "svelte";
  export let data;
  export let index;
  let canvas;
  let player;
  let fileInput;
  let supported;
  let file;
  let exif;
  let constraints = { audio: false, video: true };
  let locationWatcher;
  let locationError;
  let coordinates;

  $: console.log(locationError)
  $: console.log(coordinates)

  onMount(async () => {
    supported = "mediaDevices" in navigator;
    getLocation();
    return () => {
      if (locationWatcher) navigator.geolocation.clearWatch(locationWatcher);
    };
  });
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia/
  function photo() {
    console.log("TAKE PHOTO");
    supported = "mediaDevices" in navigator;
    // console.log(supported)
    // navigator.mediaDevices.getUserMedia(constraints)
    // .then((stream) => {
    //   player.srcObject = stream;
    // });
  }

  async function getFiles() {
    try {
      const m = await storage.getMetadata("/public/");
      console.log(m);
    } catch (error) {}
  }

  async function upload(e) {
    console.log(e.target.files);
    let f = e.target.files[0];
    file = e.target.files[0];
    exif = file.exifdata;

    // if (f) {
    //   try {
    //     console.log("awiat")
    //     const e = await storage.put("/public/"+f.name, f)
    //     console.log(e)

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
  }

  function readExif() {
    EXIF.getData(file, function () {
      var allMetaData = EXIF.getAllTags(this);
      console.log(allMetaData);
      exif = allMetaData;
      // var allMetaDataSpan = document.getElementById("allMetaDataSpan");
      // allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
    });
  }

  function getLocation(e) {
    if (locationWatcher) navigator.geolocation.clearWatch(locationWatcher);
    if (navigator.geolocation) {
      const onSuccess = (position) => {
        locationError = null;
        coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
        };
      };
      const onError = (error) => {
        switch (error.code) {
          case 0:
            locationError = "Geolocation Error: unknown error";
            break;
          case 1:
            locationError = "Geolocation Error: permission denied";
            break;
          case 2:
            locationError = "Geolocation Error: position unavailable";
            break;
          case 3:
            locationError = "Geolocation Error: timed out";
            break;
        }
      };
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      locationWatcher = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        options
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
</script>

<p>Supported: {supported}</p>
<div class="task">
  <h2>{index}. Photo Request</h2>
  <p>{data.description}</p>
  <button on:click={readExif}>Exif</button>
  <input
    type="file"
    accept="image/*"
    on:change={upload}
    bind:this={fileInput}
  />
  <button class="btn-pic" on:click={() => fileInput.click()}>
    Take Picture
  </button>
  {#if coordinates}
  <p>{coordinates.latitude} {coordinates.longitude} {coordinates.heading}</p>
  {/if}
</div>

{#if exif}
  <ul>
    {#each Object.entries(exif) as [title, paragraph]}
      <li>{title}: {paragraph}</li>
    {/each}
  </ul>
{/if}

<style>
  .task {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 255, 255);
    padding: 1rem;
    border-radius: 8px;
  }

  button {
    margin: 0 auto;
    margin-top: 1rem;
    padding: 0.7rem 1rem;
    max-width: 300px;
    display: inline-block;
    border: 0.1em solid #ffffff;
    border-radius: 0.12em;
    box-sizing: border-box;
    text-decoration: none;
    font-weight: 600;
    color: #000000;
    text-align: center;
    transition: all 0.2s;
    background-color: rgb(202, 202, 202);
    cursor: pointer;
  }

  button:hover {
    background-color: #e9e9e9;
  }

  input {
    display: none;
  }
</style>
