import { getSession, getProviders, getCsrfToken } from "next-auth/react"

export default async (req, res) => {
  const session = await getProviders({ req })
  console.log(session)
  res.send(JSON.stringify(session, null, 2))
}
/*

    <Container maxW="xl" centerContent>
      <Heading as="h1" textAlign="center">
        Welcome to our custom page
      </Heading>
      <Box alignContent="center" justifyContent="center" marginTop={12}>
        <Box className="email-form">
          <form method="post" action="/api/auth/signin/email">
            <Input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <label>
              Email address
              <Input type="text" id="email" name="email" />
            </label>
            <Button type="submit">Use your Email</Button>
          </form>
        </Box>
        <Stack isInline marginTop={12}>
          {Object.values(providers).map((provider) => {
            if (provider.name === "Email") {
              return
            }
            return (
              <Box key={provider.name}>
                <Button variant="outline" onClick={() => signIn(provider.id)}>
                  Sign in with {provider.name}
                </Button>
              </Box>
            )
          })}
        </Stack>
      </Box>
    </Container>
    */
