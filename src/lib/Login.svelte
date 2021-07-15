<script>
  import { auth } from "$lib/auth";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let email = "";
  let password = "";

  let errors = {};

  async function login() {
    try {
      await auth.login({ email, password });
    } catch (e) {
      errors["error"] = e.response.data.message;
    }
  }

  async function register() {
    try {
      await auth.register({ email, password });
    } catch (e) {
      errors["error"] = e.response.data.message;
    }
  }
</script>

<form>
  <h1>👤</h1>

  <label for="email">Email</label>
  <input name="email" type="email" placeholder="name@example.com" bind:value={email} />

  <label for="password">Password</label>
  <input name="password" type="password" bind:value={password} />

  <div class="btns">
    <button on:click|preventDefault={login}> Log in </button>
    <div>or</div>
    <button on:click|preventDefault={register}> Sign Up </button>
  </div>



</form>

{#if Object.keys(errors).length > 0}
  <ul class="errors">
    {#each Object.keys(errors) as field}
      <li>{field}: {errors[field]}</li>
    {/each}
  </ul>
{/if}

<style>
  form {
    padding: 10px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 500px;
  }
  label {
    margin: 5px 0;
    align-self: flex-start;
    font-weight: 500;
  }
  input {
    background-color: #fff;
    border: none;
    margin-bottom: 10px;
    transition: all 300ms ease-in-out;
    width: 100%;
    padding: 10px 10px;
  }
  input:focus {
    outline: 0;
    border-bottom: 1px solid var(--primary-color);
  }

  input:selected {
    outline: 0;
    border-bottom: 1px solid var(--primary-color);
  }
  button {
    background: var(--primary-color);
    color: white;
    padding: 10px 20px;
    min-width: 120px;
    border: 0;
    border-radius: 5px;
    text-transform: uppercase;
    font-weight: bold;
    cursor: pointer;
  }
  button:hover {
    box-shadow: 0px 1px 10px 0px rgba(201, 201, 201, 0.58);
  }
  h1 {
    margin: 0 20px 10px 20px;
    font-size: 30px;
  }

  .btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 2rem;
  }
  .errors {
    list-style-type: none;
    padding: 10px;
    margin: 0;
    margin-top: 20px;
    color: #be6283;
    width: 100%;
    text-align: center;
  }
  .success {
    font-size: 24px;
    text-align: center;
  }
</style>
