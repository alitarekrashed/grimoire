import styles from './loading-spinner.module.css'

export function LoadingSpinner({ loading }: { loading: boolean }) {
  return (
    loading && (
      <div className={`${styles.ldsRing}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    )
  )
}
