<script>
  import { auth, storage } from "$lib/auth";
  import { onMount } from "svelte";
  import Modal from "$lib/Modal.svelte";
  import { mutation } from "@urql/svelte";

  export let data;
  export let index;
  export let parcel;
  let canvas;
  let player;
  let stream;
  let fileInput;
  let supported;
  let file;
  let exif;
  let comment;
  let imageSrc = "";
  let user = auth.getClaim("x-hasura-user-id");

  const mutatePhoto = mutation({
    query: `
    mutation Photo($location: String = "", $uri: String = "", $token: String = "", $user_id: uuid!, $request_task_id: uuid!, $parcel_id: uuid!, $comment: String = "") {
      insert_geotagged_photo(objects: {location: $location, uri: $uri, token: $token, user_id: $user_id, request_task_id: $request_task_id, parcel_id: $parcel_id, comment: $comment}) {
        affected_rows
      }
    }
    `,
  });

  onMount(async () => {
    supported = "mediaDevices" in navigator;
  });
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia/
  async function openModal(open) {
    open()
    const constraints = { audio: false, video: { facingMode: "environment" } }

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      player.srcObject = stream;
      /* use the stream */
    } catch (err) {
      console.log(error);
      /* handle the error */
    }
  }

  async function loadPic(e) {
    console.log(e.target.files);
    file = e.target.files[0];
    imageSrc = URL.createObjectURL(file);
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

  async function submit(close) {
    if (file) {
      try {
        const e = await storage.put("/user/" + user + "/" + file.name, file);
        const m = await mutatePhoto({
          location: "bla",
          user_id: user,
          request_task_id: data.id,
          parcel_id: parcel,
          token: e.Metadata.token,
          uri: "https://cappb.terranea.de/storage/o/" + e.key,
          comment: comment,
        });
        if (m.data) {
          console.log("UPLOAD SUCCESSFUL");
        }
        if (m.error) {
          console.log(m.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
    close();
  }
</script>

<div class="task">
  <h2>{index}. Photo Request</h2>
  <p>{data.description}</p>
  <!-- <button on:click={readExif}>Exif</button> -->
  <Modal>
    <div slot="trigger" let:open>
      <button class="open" on:click={openModal(open)}
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-check"
          ><polyline points="20 6 9 17 4 12" /></svg
        > Resolve</button
      >
    </div>
    <div slot="header">
      <h2>Please move to the coordinates on the map to take a picture</h2>
    </div>
    <div class="content" slot="content">
      <input
        type="file"
        accept="image/*"
        on:change={loadPic}
        bind:this={fileInput}
        id="fileinput"
      />
      <button class="take" on:click={() => fileInput.click()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-camera"
          ><path
            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
          /><circle cx="12" cy="13" r="4" /></svg
        > Take Picture
      </button>

      <div class="preview">
        {#if supported}
        <video id="player" bind:this={player} autoplay controls=""/>
        {:else}
        {#if imageSrc}
          <img id="blah" src={imageSrc} alt="your image" />
        {/if}
        {/if}
      </div>

      <input type="text" placeholder="comment" bind:value={comment} />
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
    margin-bottom: 0.7rem;
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 255, 255);
    padding: 1rem;
    border-radius: 8px;
    position: relative;
  }

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .preview {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    margin: 1rem 0;
  }

  video {
    min-height: 0;
    flex: 1;
    width: 100%;
  }

  img {
    height: 200px;
    flex: 1;
    min-height: 0;
    width: 100%;
    object-fit: cover;
  }

  button {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    outline: 0;
    border: none;
    cursor: pointer;
    font-weight: 600;
    border-radius: 4px;
    font-size: 13px;
    min-height: 30px;
    background-color: #0000000d;
    color: #0e0e10;
    padding: 0 0.6rem;
  }

  button:hover {
    background-color: #0000001a;
  }

  button svg {
    margin-right: 0.5rem;
  }

  button.open {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  button.take {
    margin: 0 auto;
    padding: 0.6rem 1rem;
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

  #fileinput {
    display: none;
  }
</style>
