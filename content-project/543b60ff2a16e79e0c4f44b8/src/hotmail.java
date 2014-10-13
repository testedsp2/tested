import org.testng.*;
import org.openqa.selenium.*;
public class hotmail{
@Test
public void hotmail_test(){
WebDriver driver = new FirefoxDriver();
WebDriverWait wait = new WebDriverWait(driver,15);
driver.get("http://hotmail.com");
wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("boton")));
driver.findElement(By.id("boton")).click();
wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("input")));
driver.findElement(By.className("input")).sendKeys("porfavor");
wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[text()='funciona']")));
driver.findElement(By.xpath("//*[text()='funciona']")).sendKeys("");
wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("save")));
driver.findElement(By.id("save")).click();
try{
wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("funciono")));
wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("feliz")));
wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[text()='jajajaja']")));
}catch(Exception e){
Assert.fail(" MENSAJE DE ERROR " + e.getMessage());
}driver.close();
}
}