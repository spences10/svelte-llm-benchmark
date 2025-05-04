<script lang="ts">
  // Component that declares and uses props using $props()
  let { name, age = 0 } = $props(); // Declare props with a default value for age
</script>

<div>
  <p>Name: {name}</p>
  <p>Age: {age}</p>
</div>
