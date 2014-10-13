import org.testng.*;
import org.openqa.selenium.*;
public class facebook{
	WebDriver driver;
	WebDriverWait wai;

	@Test
	public void facebook_test(){
		driver = new FirefoxDriver();
		wait = new WebDriverWait(driver,15);
		driver.get("http://www.facebook.com");
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("bot ")));
		driver.findElement(By.id("bot ")).click();
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("input")));
		driver.findElement(By.className("input")).sendKeys("");
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[text()='save']")));
		driver.findElement(By.xpath("//*[text()='save']")).click();
		try{
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("desition1")));
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("desiton2")));
		}catch(Exception e){
			Assert.fail(" MENSAJE DE ERROR " + e.getMessage());
		}
	}

	@AfterClass
	public void closeDriver(){
		driver.close();
	}
}