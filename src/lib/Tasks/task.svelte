<script>
  import { storage } from "$lib/auth";
  import { onMount } from "svelte";
  import Modal from "$lib/Modal.svelte";

  export let data;
  export let index;
  let canvas;
  let player;
  let fileInput;
  let supported;
  let file;
  let exif;
  let constraints = { audio: false, video: true };

  onMount(async () => {

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



  function submit(close) {
    close();
  }
</script>

<div class="task">
  <h2>{index}. Photo Request</h2>
  <p>{data.description}</p>
  <!-- <button on:click={readExif}>Exif</button> -->
  <Modal>
    <div slot="trigger" let:open>
      <button class="open" on:click={open}>Take Picture</button>
    </div>
    <div slot="header">
      <h2>Please move to the coordinates on the map to take a picture</h2>
    </div>
    <div class="content" slot="content">
      <input
        type="file"
        accept="image/*"
        on:change={upload}
        bind:this={fileInput}
      />
      <button class="take" on:click={() => fileInput.click()}>
        Take Picture
      </button>
    </div>

    <div slot="footer" let:store={{ close }}>
      <div class="fbtn">
        <button on:click={close}>Close</button>
        <button class="sub" on:click={submit(close)}>Submit</button>
      </div>
    </div>
  </Modal>
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

  .content {
    display: flex;
    flex-direction: column;
  }

  button {
    margin: 0;
    display: inline-block;
    outline: 0;
    border: none;
    cursor: pointer;
    font-weight: 600;
    border-radius: 4px;
    font-size: 13px;
    min-height: 30px;
    background-color: #0000000d;
    color: #0e0e10;
    padding: 0 1rem;
  }

  button:hover {
    background-color: #0000001a;
  }

  button.open {
    margin-top: 1rem;
  }

  button.take {
    margin: 0 auto;
    padding: .6rem 1rem;
    margin-top: 1rem;
  }

  .fbtn {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
  }

  button.sub {
    background-color: var(--primary-color);
  }

  input {
    display: none;
  }
</style>
