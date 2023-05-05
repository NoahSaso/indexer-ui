import { LinkRounded } from '@mui/icons-material'

import { Link, Tag, TryItOut } from '@/components'

const Home = () => {
  return (
    <div className="mx-auto flex max-w-prose flex-col gap-4">
      <p className="hero-text">CosmWasm Indexer</p>

      <div className="flex flex-col gap-2">
        <p className="header-text">Why?</p>
        <p>
          Rather than indexing the transactions and events that end up in a
          block like most indexers, this indexer only cares about the{' '}
          <b>state</b> in smart contracts.
        </p>

        <p>Most indexers cannot access CW20 token balances. This one can.</p>

        <p>This allows for:</p>
        <ul className="list-inside">
          <li>Contract-to-contract (submessage) support</li>
          <li>Blazing fast UI via contract query replacement</li>
          <li>Instant historical data</li>
        </ul>

        <p>
          This indexer is the reason{' '}
          <Link
            href="https://daodao.zone"
            rel="noopener noreferrer"
            target="_blank"
          >
            DAO DAO
          </Link>{' '}
          is so fast.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="header-text">Where?</p>
        <p>
          This indexer currently runs on{' '}
          <Link
            href="https://junonetwork.io"
            rel="noopener noreferrer"
            target="_blank"
          >
            Juno
          </Link>
          .
        </p>

        <p>
          Want it on another chain?{' '}
          <Link
            href="mailto:noah@indexer.zone"
            rel="noopener noreferrer"
            target="_blank"
          >
            Email me
          </Link>{' '}
          or{' '}
          <Link
            href="https://twitter.com/noahsaso"
            rel="noopener noreferrer"
            target="_blank"
          >
            DM me on Twitter
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="header-text">How?</p>

        <p>The contract API is very straightforward and documented below.</p>

        <p>
          To perform more complex queries or write custom formulas, such as
          aggregated contract state for a specific wallet (like cw20 token
          balances), contact me using one of the links above.
        </p>

        <p>
          This indexer runs on Juno mainnet and testnet. It is accessible via:
        </p>
        <ul className="list-inside">
          <li>
            <Tag>https://juno-mainnet.indexer.zone</Tag>
          </li>
          <li>
            <Tag>https://juno-testnet.indexer.zone</Tag>
          </li>
        </ul>

        <p>
          When you create a key, you will be shown a one-time API key to put in
          the <Tag>X-API-Key</Tag> header of your requests. Once you fund it
          with credits, it will work immediately.
        </p>

        <p className="title-text mt-3">Contract API</p>

        <div className="mt-2 flex flex-col gap-2 rounded-md bg-background-tertiary p-4 pt-0">
          <div className="title-text -mx-4 mb-1 flex flex-row flex-wrap items-center gap-1 border-b border-border-base p-4 font-mono font-normal">
            <LinkRounded className="mr-2 !h-6 !w-6 -rotate-45" />

            <p>
              /contract/<Tag>address</Tag>/item
            </p>
          </div>

          <p>
            This endpoint takes either <Tag>key</Tag> or <Tag>keys</Tag> in its
            query string and returns the value from an <Tag>Item</Tag> or value
            at a specific key in a <Tag>Map</Tag>.
          </p>

          <p className="mt-4">
            <Tag>key</Tag> is used to access state from a smart contract{' '}
            <Tag>Item</Tag>. The query that gets the value of the item with key{' '}
            <Tag>config</Tag> from the smart contract with address{' '}
            <Tag>address</Tag> would look like this:
          </p>

          <div className="flex flex-row flex-wrap items-center gap-2 rounded-md bg-background-secondary p-2 font-mono text-xs">
            <LinkRounded className="!h-5 !w-5 -rotate-45" />
            <p>
              /contract/<Tag>address</Tag>/item?key=<Tag>config</Tag>
            </p>
          </div>

          <p className="mt-4">
            <Tag>keys</Tag> is used to access state from a smart contract{' '}
            <Tag>Map</Tag>. The query that gets the value of the{' '}
            <Tag>wallet</Tag> key in a map with key <Tag>balances</Tag> would
            look like this:
          </p>

          <div className="flex flex-row flex-wrap items-center gap-2 rounded-md bg-background-secondary p-2 font-mono text-xs">
            <LinkRounded className="!h-5 !w-5 -rotate-45" />
            <p>
              /contract/<Tag>address</Tag>/item?keys=
              <Tag>&quot;balances&quot;:&quot;wallet&quot;</Tag>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-md bg-background-tertiary p-4 pt-0">
          <div className="title-text -mx-4 mb-1 flex flex-row flex-wrap items-center gap-1 border-b border-border-base p-4 font-mono font-normal">
            <LinkRounded className="mr-2 !h-6 !w-6 -rotate-45" />

            <p>
              /contract/<Tag>address</Tag>/map
            </p>
          </div>

          <p>
            This endpoint takes either <Tag>key</Tag> or <Tag>keys</Tag> in its
            query string, as well as an optional <Tag>numeric</Tag> field, and
            returns the entire contents of a <Tag>Map</Tag>.
          </p>

          <p className="mt-4">
            <Tag>key</Tag> is used to access a single-keyed <Tag>Map</Tag>. The
            query that gets the map with key <Tag>balances</Tag> from the smart
            contract with address <Tag>address</Tag> would look like this:
          </p>

          <div className="flex flex-row flex-wrap items-center gap-2 rounded-md bg-background-secondary p-2 font-mono text-xs">
            <LinkRounded className="!h-5 !w-5 -rotate-45" />
            <p>
              /contract/<Tag>address</Tag>/map?key=<Tag>balances</Tag>
            </p>
          </div>

          <p className="mt-4">
            <Tag>keys</Tag> is used to access a multi-keyed <Tag>Map</Tag>. The
            query that gets the map at the <Tag>address</Tag> key prefix in a
            multi-keyed map with key <Tag>allowance</Tag> would look like this:
          </p>

          <div className="flex flex-row flex-wrap items-center gap-2 rounded-md bg-background-secondary p-2 font-mono text-xs">
            <LinkRounded className="!h-5 !w-5 -rotate-45" />
            <p>
              /contract/<Tag>address</Tag>/map?keys=
              <Tag>&quot;allowance&quot;:&quot;address&quot;</Tag>
            </p>
          </div>

          <p className="mt-4">
            <Tag>numeric</Tag> tells the map decoder if the keys are numbers. If
            omitted or empty, the keys are treated as strings. If defined, the
            keys are treated as numbers. The query that gets the map with key{' '}
            <Tag>proposals</Tag> whose keys are numeric IDs that map to objects
            would look like this:
          </p>

          <div className="flex flex-row flex-wrap items-center gap-2 rounded-md bg-background-secondary p-2 font-mono text-xs">
            <LinkRounded className="!h-5 !w-5 -rotate-45" />
            <p>
              /contract/<Tag>address</Tag>/map?key=<Tag>proposals</Tag>
              &numeric=true
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="header-text">Try it out</p>

        <p>
          Use the widget below to try getting some state from a smart contract.
        </p>

        <TryItOut />
      </div>
    </div>
  )
}

export default Home
