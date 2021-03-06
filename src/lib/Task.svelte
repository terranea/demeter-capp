<script>
  import { auth, storage } from "$lib/auth";
  import { onMount, onDestroy } from "svelte";
  import Modal from "$lib/Modal.svelte";
  import { mutation, operationStore, query } from "@urql/svelte";
  import turfdistance from "@turf/distance";

  export let task = "";
  export let index;
  export let parcel;
  export let userLocation;
  let loading = false;
  let resolved = false;
  let submitActive = false;
  let player;
  let stream;
  let fileInput;
  let supported;
  let file;
  let exif;
  let comment;
  let imageSrc = "";
  let loadedImg;
  let user = auth.getClaim("x-hasura-user-id");

  const mutatePhoto = mutation({
    query: `
    mutation Photo($location: geography!, $url: String = "", $token: String = "", $user_id: uuid!, $request_task_id: uuid!, $parcel_id: uuid!, $comment: String = "", $exif: json) {
      insert_geotagged_photo(objects: {location: $location, url: $url, token: $token, user_id: $user_id, request_task_id: $request_task_id, parcel_id: $parcel_id, comment: $comment, exif: $exif}) {
        affected_rows
      }
    }
    `,
  });

  const photos = operationStore(
    `
    query GeotaggedPhoto($id: uuid!) {
      geotagged_photo(where: {request_task_id: {_eq: $id}}) {
        id
        created
        url
        token
      }
    }
    `,
    { id: task.id },
    { requestPolicy: "cache-and-network" }
  );

  $: if ($photos.data && $photos.data.geotagged_photo.length === 1) {
    resolved = true;
    imageSrc =
      $photos.data.geotagged_photo[0].url +
      "?token=" +
      $photos.data.geotagged_photo[0].token;
  }
  query(photos);
  onMount(async () => {
    // supported = "mediaDevices" in navigator;
  });

  onDestroy(() => {
    stopMediaStream();
  });

  $: distance = calcDistance()

  function calcDistance() {
    let distance = 0
    if (task && task.location.coordinates && userLocation && userLocation.coordinates) {
      try {
        distance = turfdistance(userLocation.coordinates, task.location.coordinates, {units: 'kilometers'});
      } catch (error) {
        console.log(error)
      }
    }
    if (distance < 1) {
      return Math.round(distance * 100) / 100 * 1000 + " m"
    } else {
      return Math.round(distance * 100) / 100 + " km"
    }
  }

  function readExif(file) {
   EXIF.getData(file, function() {
      var allMetaData = EXIF.getAllTags(this)
      exif = allMetaData
      submitActive = true
    });
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia/
  async function openModal(open) {
    open();
    if (supported) {
      const constraints = {
        audio: false,
        video: { facingMode: "environment" },
      };

      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        player.srcObject = stream;
        /* use the stream */
      } catch (err) {
        console.log(error);
        /* handle the error */
      }
    }
  }

  async function loadPic(e) {
    exif = {}
    file = e.target.files[0];
    imageSrc = URL.createObjectURL(file);
    readExif(file)
   }

  async function submit(close) {
    close();
    loading = true;
    console.log(exif)
    if (file) {
      try {
        const e = await storage.put("/user/" + user + "/" + file.name, file);
        const m = await mutatePhoto({
          location: userLocation,
          user_id: user,
          request_task_id: task.id,
          parcel_id: parcel,
          token: e.Metadata.token,
          url: "https://cappb.terranea.de/storage/o/" + e.key,
          comment: comment,
          exif: exif
        });
        if (m.data) {
          loading = false;
          resolved = true;
          console.log("UPLOAD SUCCESSFUL");
        }
        if (m.error) {
          console.log(m.error);
          loading = false;
          resolved = false;
        }
      } catch (error) {
        console.log("Error", error);
        loading = false;
        resolved = false;
      }
    }
  }

  function closeModal(close) {
    stopMediaStream();
    close();
  }

  function stopMediaStream() {
    if (stream) {
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  }

</script>

<div class="task">
  <h2>{index}. Photo Request</h2>
  <p>{task.description}</p>
  <p class="distance">You are <strong>{distance}</strong> away from the requested location.</p>

  <Modal>
    <div slot="trigger" let:open>
      <button class="open" on:click={openModal(open)} disabled={loading}>
        {#if $photos.fetching || loading}
          <div class="lds-dual-ring" />
        {:else if resolved}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="green"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
          >
        {/if}
        {resolved ? "Resolved" : "Resolve"}</button
      >
    </div>
    <div slot="header">
      {#if !resolved}
        <h2>Please move to the coordinates on the map to take a picture</h2>
        <p class="distance">You are <strong>{distance}</strong> away from the requested location.</p>
      {/if}
    </div>
    <div class="content" slot="content">
      <input
        type="file"
        accept="image/*"
        capture
        on:change={loadPic}
        bind:this={fileInput}
        id="fileinput"
      />
      {#if !resolved}
        <button
          class="take"
          on:click={() => fileInput.click()}
          disabled={resolved}
        >
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
            class=""
            ><path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
            /><circle cx="12" cy="13" r="4" /></svg
          > Take Picture
        </button>
      {/if}

      <div class="preview">
        {#if supported}
          <video
            bind:this={player}
            autoplay
            webkit-playsinline
            playsinline
            controls=""
          />
          {/if}
          <img bind:this={loadedImg} id="capturedImg" src={imageSrc || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt="your image" />
        </div>

      <input type="text" placeholder="comment" bind:value={comment} />
    </div>

    <div slot="footer" let:store={{ close }}>
      <div class="fbtn">
        <button on:click={closeModal(close)}>Close</button>
        {#if !resolved}
        <button class="{submitActive ? "sub" : "inactive"}" on:click={submit(close)} disabled={!submitActive}
          >Submit</button>
        {/if}
      </div>
    </div>
  </Modal>
</div>

<style>
  .task {
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 255, 255);
    padding: 0.6rem 1rem;
    border-radius: 8px;
    position: relative;
    width: 100%;
    min-height: 100px;
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

  .inactive {
    background-color:rgba(0, 0, 0, 0.1);
  }

  svg.resolved {
    stroke: green;
    display: block;
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
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  }

  button:hover {
    background-color: #0000001a;
  }

  button svg {
    margin-right: 0.5rem;
  }

  button.open {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
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

  .distance {
    margin-top: .4rem;
  }

  button.sub {
    background-color: var(--primary-color);
  }

  #fileinput {
    display: none;
  }

  .lds-dual-ring {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 0.5rem;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 3px solid var(--primary-color);
    border-color: var(--primary-color) transparent var(--primary-color)
      transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
