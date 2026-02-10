import React from 'react'

interface GraphViewProps {
  user: Keycloak.KeycloakProfile | null;
}
function GraphView({ user }: GraphViewProps) {
  return (
    <div>GraphView</div>
  )
}

export default GraphView
