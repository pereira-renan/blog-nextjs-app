import React from "react"
import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react"
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Container,
  Stack,
} from "@chakra-ui/react"
export default function SignIn({ providers, csrfToken }) {
  return (
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
  )
}

export async function getServerSideProps(context) {
  const { req, res } = context
  console.log
  const session = await getSession({ req })

  if (session && res && session.accessToken) {
    res.writeHead(302, {
      Location: "/",
    })
    res.end()
    return
  }
  const providers = await getProviders(context)
  //console.log(providers)

  return {
    props: {
      session: null,
      providers: providers,
      //providers: await getProviders(context),
      csrfToken: await getCsrfToken(context),
    },
  }
}
