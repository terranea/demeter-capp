<script>
  import { auth } from "$lib/auth";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher()

  let email = "";
  let password = "";
  let isLoading = false;

  let errors = {};

  async function submit() {
    try {
      const u = await auth.login({ email, password })
    } catch (e) {
      errors["error"] = e.response.data.message
    }

  }
</script>

<form on:submit|preventDefault={submit}>
    <h1>👤</h1>

    <label>Email</label>
    <input name="email" placeholder="name@example.com" bind:value={email} />

    <label>Password</label>
    <input name="password" type="password" bind:value={password} />

    <button type="submit">
      {#if isLoading}Logging in...{:else}Register{/if}
    </button>

    {#if Object.keys(errors).length > 0}
      <ul class="errors">
        {#each Object.keys(errors) as field}
          <li>{field}: {errors[field]}</li>
        {/each}
      </ul>
    {/if}
</form>

<style>
  form {
    padding: 50px;
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  label {
    margin: 10px 0;
    align-self: flex-start;
    font-weight: 500;
  }
  input {
    background-color: #fff;
    border: none;
    margin-bottom: 20px;
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
    margin-top: 20px;
    background: var(--primary-color);
    color: white;
    padding: 10px 0;
    width: 200px;
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
    margin: 10px 20px 30px 20px;
    font-size: 40px;
  }
  .errors {
    list-style-type: none;
    padding: 10px;
    margin: 0;
    margin-top: 20px;
    color: #be6283;
  }
  .success {
    font-size: 24px;
    text-align: center;
  }
</style>
