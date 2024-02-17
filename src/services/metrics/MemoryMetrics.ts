import StaticComponent from "../../lib/StaticComponent";

class MemoryMetrics extends StaticComponent {
  static getMemoryUsage(): any {
    return process.memoryUsage();
  }

  static getMemoryUsageRss(): string {
    const rss: number = process.memoryUsage()?.rss;

    if(rss) {
      return ""+(rss/1000000).toFixed(2)+"MB"
    }

    return 'undefined';
  }

  static getMemoryUsageFormatted(): string {
    const memoryUsage = this.getMemoryUsage();
    const memoryUsageFormatted = {...memoryUsage};
    const keys = Object.keys(memoryUsageFormatted);

    for(const key of keys) {
      const value = memoryUsageFormatted[key];
      memoryUsageFormatted[key] = ""+(parseInt(value)/1000000).toFixed(2)+"MB"
    }

    return JSON.stringify(memoryUsageFormatted);
  }
}

export default MemoryMetrics;
