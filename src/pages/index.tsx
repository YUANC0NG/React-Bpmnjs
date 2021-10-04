import styles from './index.less';
import Bpmn from './Bpmn';

export default function IndexPage() {
  return (
    <div  className={styles.title}>
      <Bpmn/>
    </div>
  );
}
