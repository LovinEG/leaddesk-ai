import './Card.css'

function Card({ children, className }) {
  return (
    <section className={className ? `card ${className}` : 'card'}>
      {children}
    </section>
  )
}

export default Card